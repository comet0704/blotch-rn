***android 빌드방법***

1. 준비

    node 설치 (버전: v10.15.3 (lts) 설치하였음)

    npm i -g expo-cli (2.13.0 설치하였음, 그 이상도 상관없음)
    
    npm install (package.json 파일에 있는 모듈 설치)


2. 빌드
    - expo build:android

     (expo계정에 로그인해야함, 위 명령을 실행하면 signing 파일을 자체생성? 이미있던 파일 추가 선택옵션이 나옴. 경우에 맞게 선택)
   

***iOS 빌드방법***

1. 준비

    - node 설치 (버전: v10.15.3 (lts) 설치하였음)  
    brew install node  

    - node 패키지 설치  
    cd blotch-hybrid && sudo npm install  

2. 빌드  
    sudo expo build:ios  

3. 배포  
    sudo expo upload:ios  
    혹은 각종 정보입력없이 업로드하려면 ...  
    sudo ./upload.sh  

4. 오류해결
    - start_with? 오류가 나오는 경우  
    sudo expo diagnostics  
    위 지령으로 확인해보면 Xcode 에 undefined 로 나오면 xcode 가 전혀 실행되지 않았다거나 연결이 안되어있는 상태이다.  
    이때에는...  
    sudo xcode-select -s /Applications/Xcode.app  

    - certificate & provisionning 을 다시 생성하거나 revoke 했을때
    sudo expo build:ios --clear-credentials  
    혹은 expo가 삭제 & 생성하게 하려면  
    sudo expo build:ios --clear-credentials --revoke-apple-dist-certs --revoke-apple-push-certs --revoke-apple-provisioning-profile

    - Switch to Push Notification Key on iOS  
    If you are using Push Notifications Certificate and want to switch to Push Notifications Key you need to start build with --clear-push-cert. We will remove certificate from our servers and generate Push Notifcations Key for you.


