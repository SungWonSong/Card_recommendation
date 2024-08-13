const { sequelize, Comment, User, CommentLike, Sequelize } = require('../models');
const Op = Sequelize.Op;

// 댓글 수 조회
const countTotalComments = async (cardId) => {
  return await Comment.count({
    where: { card_id: cardId },
  });
};

// 상위 댓글 리스트 조회
const fetchTopComments = async (cardId, limit = 2) => {
  try {
    const topComments = await Comment.findAll({
      where: { card_id: cardId },
      include: [{
        model: User,
        attributes: ['userid', 'nickname'],
      }],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM CommentLike AS cl
              WHERE cl.comment_id = Comment.comment_id
            )`),
            'likeCount'
          ]
        ]
      },
      order: [
        [sequelize.literal('likeCount'), 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit,
    });

    return topComments;
  } catch (error) {
    console.error('Error fetching top comments:', error);
    throw error;
  }
};

// 나머지 댓글 리스트 조회
const fetchComments = async (cardId, limit, offset, excludeIds = []) => {
  try {
    const comments = await Comment.findAll({
      where: {
        card_id: cardId,
        comment_id: { [Op.notIn]: excludeIds }
      },
      include: [{
        model: User,
        attributes: ['userid', 'nickname'],
      }],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM CommentLike AS cl
              WHERE cl.comment_id = Comment.comment_id
            )`),
            'likeCount'
          ]
        ]
      },
      offset,
      order: [['createdAt', 'DESC']],
    });

    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// 댓글 조회
const getComments = async (cardId, page = 1, limit = 5) => {
  const offset = (page - 1) * limit;

  const totalComments = await countTotalComments(cardId);

  // 상위 2개의 댓글 먼저 조회
  const topComments = await fetchTopComments(cardId);
  const topCommentIds = topComments.map(comment => comment.comment_id);

  // 나머지 댓글 최신순으로 조회, 상위 2개의 댓글 제외
  const comments = await fetchComments(cardId, limit, offset, topCommentIds);
  const totalPages = Math.ceil(totalComments / limit);

  // 상위 2개의 댓글을 앞에 추가
  const mergedComments = [...topComments, ...comments];

  return {
    comments: mergedComments,
    totalPages,
    currentPage: page,
  };
};

// 댓글 보여주기
exports.showComments = async (req, res) => {
  const cardId = req.query.card_id;
  const page = parseInt(req.query.page) || 1;

  try {
    const { comments, totalPages, currentPage } = await getComments(cardId, page);

    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      // AJAX 요청이거나 JSON 응답을 요구하는 경우
      return res.json({
        comments,
        totalPages,
        currentPage,
      });
    } else {
      res.render('comment', {
        comments,
        currentPage,
        totalPages,
        user: req.user,
        cardId,
      });
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send('Internal Server Error');
  }
};

// 댓글 추가
exports.addComment = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: '현재 로그인된 유저 없음' });
  }

  const { comment_contents, card_id } = req.body;
  const newComment = {
    comment_contents,
    userid: req.user.userId,
    card_id,
    createdAt: new Date(), // 명시적으로 createdAt 값을 설정하여 일관성 유지
  };

  try {
    const createdComment = await Comment.create(newComment);
    const fullComment = await Comment.findByPk(createdComment.comment_id, {
      include: [{
        model: User,
        attributes: ['nickname']
      }]
    });

    const totalComments = await Comment.count({
      where: { card_id: card_id }
    });
    const totalPages = Math.ceil(totalComments / 5); // 5개씩 페이지네이션

    // 좋아요 수 포함
    fullComment.dataValues.likeCount = 0;

    res.status(201).json({ comment: fullComment, totalComments, totalPages });
  } catch (error) {
    console.error('Error posting comment:', error);
    res.status(500).send('Internal Server Error');
  }
};

// 댓글 수정
exports.editComment = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: '현재 로그인된 유저 없음' });
  }

  const { id } = req.params;
  const { comment_contents } = req.body;
  const comment = await Comment.findByPk(id);

  if (comment.userid !== req.user.userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  comment.comment_contents = comment_contents;
  await comment.save();
  res.status(200).json(comment);
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: '현재 로그인된 유저 없음' });
  }

  const { id } = req.params;
  const comment = await Comment.findByPk(id);

  if (comment.userid !== req.user.userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await comment.destroy();
  res.status(200).json({ message: '삭제 완료' });
};

// 좋아요 토글
exports.toggleLike = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: '로그인이 필요합니다. ' });
  }

  const { comment_id, card_id } = req.body; // card_id 추가
  const user_id = req.user.userId;
  const transaction = await sequelize.transaction();

  try {
    const existingLike = await CommentLike.findOne({
      where: { comment_id, user_id },
      transaction
    });

    if (existingLike) {
      // 좋아요 취소
      await existingLike.destroy({ transaction });
    } else {
      // 좋아요 추가
      await CommentLike.create({ comment_id, user_id, card_id }, { transaction });
    }

    // 좋아요 수 업데이트
    const likeCount = await CommentLike.count({ where: { comment_id }, transaction });
    await transaction.commit();

    // 댓글 목록을 다시 조회
    const { comments, totalPages, currentPage } = await getComments(card_id, 1, 5);

    return res.status(200).json({ message: '좋아요 토글 완료', likeCount, comments, totalPages, currentPage });
  } catch (error) {
    await transaction.rollback();
    console.error('Error toggling like:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
