# (리팩토링)Card_Recommendation([Notion 링크✔️](https://www.notion.so/Card_Recommendation-7524439a9e484de5a01b5e83d6e3d5c7?pvs=4))
>
- **사회 초년생들의 카드 선택에 있어서 도움을 주고자 하는 검색 사이트 + 카드에 대한 유저들의 생각 공유 커뮤니티**
- **리팩토링 이유 : 확장성이 부족하며, 백엔드 개발자의 측면에서 프로젝트 개선 필요성을 느껴서 진행**
- **ver.1 -> ver.2로 리팩토링 완료**
  

![_아움_](https://github.com/user-attachments/assets/e9297163-d861-4f98-a132-69000640060b)
   <br>
   
팀원 소개 👨‍👩‍👧‍👦
---



| [송성원](https://github.com/SungWonSong) | [양태완](https://github.com/behindy3359) |
|:---:| :---: |
| <img alt="스크린샷 2024-08-23 오전 2 48 59" src="https://github.com/user-attachments/assets/560d86a2-4a65-487c-b0a7-7442f4368c14" width="300" height="400"> | <img alt="스크린샷 2024-08-23 오전 3 16 04" src="https://github.com/user-attachments/assets/91e31653-fb15-45d1-bec5-77bc319b0998" width="300" height="400">
|팀원|팀원|
<br>

기술 스택 💻
---
Front-End 

![68747470733a2f2f696d672e736869656c64732e696f2f62616467652f48544d4c2d4533344632363f7374796c653d666c6174266c6f676f3d68746d6c35266c6f676f436f6c6f723d7768697465](https://user-images.githubusercontent.com/116135174/224563690-49f7978a-08cc-444e-b68d-25f8f3dca096.svg)
![68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4353532d3135373242363f7374796c653d666c6174266c6f676f3d63737333266c6f676f436f6c6f723d7768697465](https://user-images.githubusercontent.com/116135174/224563708-a893b2d2-3a9f-437c-90f9-2fb1e4b5d59c.svg)
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=JavaScript&logoColor=white">

Back-End 

<img src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=MySQL&logoColor=white"> <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/Sequelize-52B0E4?style=flat&logo=sequelize&logoColor=white"> <img src="https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white">

Server 

![Naver Cloud](https://img.shields.io/badge/Naver%20Cloud-03C75E?style=flat&logo=Naver&logoColor=white)


Etc

![68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4769746875622d3138313731373f7374796c653d666c6174266c6f676f3d676974687562266c6f676f436f6c6f723d7768697465](https://user-images.githubusercontent.com/116135174/224564009-4100e123-0818-44f8-acba-bc5d0540d66c.svg)
![68747470733a2f2f696d672e736869656c64732e696f2f62616467652f536c61636b2d3441313534423f7374796c653d666c6174266c6f676f3d736c61636b266c6f676f436f6c6f723d7768697465](https://user-images.githubusercontent.com/116135174/224564017-f1c15951-64d8-4352-866a-12ca984e6424.svg)
![68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4e6f74696f6e2d3030303030303f7374796c653d666c6174266c6f676f3d6e6f74696f6e266c6f676f436f6c6f723d7768697465](https://user-images.githubusercontent.com/116135174/224564022-db759b69-a20d-4ec6-9bdb-7fa96bf36d69.svg)
<br>

ERD (DB 재설계) 👓
---
<img width="1389" alt="스크린샷 2024-09-03 오전 12 37 23" src="https://github.com/user-attachments/assets/c435fc29-0f70-4beb-955f-fcaa1f944050">
<br>
<br>

>**토론 쟁점 < ver.1에서 ver.2로 바꿀필요가 있을까 >**
>- 테이블의 분리는 즉 쿼리의 join을 통해서 조회해야되서 성능 저하라고 볼 수 있지 않는가?

<details>
<summary> ver.1 -> ver.2</summary>
<br>
  
ver.1의 이점
- 단일 구조로 한번의 조회로 모든 카드 정보를 얻을 수 있어 성능상 이점이 있을 수 있다.
- 단일 구조로 관리하면서 직관적이며 테이블 관리에는 쉽다.

ver.2로 바꾼이유
- 프로젝트의 확장성 : 향후 새로운 카테고리 / 유형이 추가될 예정이라고 생각한다면 확장성의 부분에서 필요성 판단
- 데이터 중복 문제 : 구조에서 데이터 중복
- 결론 : 우리는 확장성을 보고 성능에서의 저하를 받아들이고 테이블 구조를 분리하였다.
</details><br>

📌 B.E 개발자로서 리팩토링 📌
---
1. Jwt 토큰 + 쿠키 ( 인증 & 인가 )
2. 검색엔진 추가
3. 성능 개선 측정 ( 전 / 후 )


