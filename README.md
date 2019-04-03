**android/ios 빌드방법**

1. 준비

    node 설치 (버전: v10.15.3 (lts) 설치하였음)

    npm i -g expo-cli (2.13.0 설치하였음, 그 이상도 상관없음)
    
    npm install (package.json 파일에 있는 모듈 설치. mac에서는 설치가 안될때는 package-lock.json 파일을 지우고 하면 설치됨)
2. - expo build:android

     (expo계정에 로그인해야함, 위 명령을 실행하면 signing 파일을 자체생성? 이미있던 파일 추가 선택옵션이 나옴. 경우에 맞게 선택)
   - expo build:ios