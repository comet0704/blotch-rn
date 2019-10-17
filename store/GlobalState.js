import { observable } from "mobx";

// mobx : 스플래쉬 깜빡임현상이 이슈로 제기되어 로그인후 앱 reloading 이 아닌 state 변경으로 로직을 바꾸기 위해 이용.
// 간단히 login 상태만 글로벌로 관리함. 기타 로그인 정보는 이전처럼 global 변수로 접근함.
const GlobalState = observable({
    loginStatus: 0 // 0 => 로딩중, -1 : 비회원, 1 : 회원
})

export default GlobalState