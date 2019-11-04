#export EXPO_DEBUG=true
export EXPO_APPLE_ID="designbak@naver.com"
export EXPO_APPLE_ID_PASSWORD="Stoy8429!@"
export FASTLANE_ITC_TEAM_ID="117912098"
export FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD="hnpn-kwyd-yjik-pycu"

# [주의] 이전의 인증서를 모두 삭제하고 새로 빌드됨, 특별히 삭제할 필요가 없다면 expo build:ios 만 이용.
expo build:ios --clear-credentials --revoke-credentials

#expo build:ios
#expo upload:ios
