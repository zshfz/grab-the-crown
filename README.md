# README

## 👑 왕관을 자바쓰 : 실시간 채팅 기반 게임 프로그램
![Image](https://github.com/user-attachments/assets/d450ee3a-ec63-4bfb-8cba-756635c9e5ee)
- 배포 url : [https://grab-the-crown.onrender.com/](https://grab-the-crown.onrender.com/)

## 1. 프로젝트 소개

- **왕관을 자바쓰**는 실시간 채팅 기반 CS 퀴즈 게임
- 여러 명의 사용자가 게임방에 입장하여 제한 시간 내에 퀴즈를 풀고 정답을 맞추어 점수를 흭득
게임이 끝나면 가장 높은 점수를 받은 사용자가 왕관을 획득
- 게임의 목표가 왕관을 얻는다는 것과 프론트엔드, 백엔드 모두 자바스크립트를 이용해서 개발했기 때문에 프로젝트 이름을 왕관을 자바쓰(자바스크립트)로 정함

## 2. 팀원 구성 및 역할 담당

| 김송이 | 김지우 | 이정민 | 이채린 |
| --- | --- | --- | --- |
| [@kimsongie12](https://github.com/kimsongie12) | [@jiu702](https://github.com/jiu702) | [@zshfz](https://github.com/zshfz) | [@Rix01](https://github.com/Rix01) |
| 백엔드 | 백엔드 | 프론트엔드 | 백엔드 |

## 3. 설계 문서 및 산출물
- 
## 4. 개발 환경

- 프론트엔드 : React, Scss
- 백엔드 : Node.js
- DB : MySQL, Azure
- 협업 툴 : GitHub, notion
- 배포 환경 : Render

## 5. 개발 기술

### 프론트엔드

- React
    - UserCard, RoomCard 등 반복적으로 사용되는 UI 요소를 독립적인 컴포넌트로 분리하여 재사용성과 유지보수성을 고려
    - react-router-dom을 사용한 라우팅 처리
    - ContextAPI를 사용하여 회원정보, 로그인, 로그아웃 기능을 구현함으로써 전역적으로 관리
    - useRef 훅을 사용하여 채팅창 자동 스크롤, 카운트다운 타이머 유지 등의 기능을 구현
    - Axios로 API 요청 처리
    - .env 파일에 환경 변수로 서버 주소를 관리하여 로컬 환경이나 배포 환경에서 프로그램을 실행할 때 용이하게 함
- SCSS
    - CSS에 중첩 구조를 사용하여 가독성 향상
    - mixin 기능을 사용하여 공통적으로 많이 쓰이는 색상이나 스타일을 따로 정의하여 일관된 UI 설계
- Socket.io
    - 채팅, 금칙어 필터링, 점수 갱신, 방 생성/삭제 등의 이벤트를 실시간으로 처리
    - 클라이언트측에서는 socket.js에서 전역 소켓 객체를 초기화하고 각 페이지에서 해당 이벤트를 구독하고 해제하는 방식으로 구현
- Vite
    - React 프로젝트의 빌드 속도와 개발 서버의 속도를 고려해 CRA(Create React App) 대신 Vite 사용

### 백엔드
## 6. 페이지별 기능
## 7. 개선 목표
## 8. 프로젝트 후기
