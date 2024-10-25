declare module '*.vue' {
    import {DefineComponent} from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare global {
    //设置全局属性
    interface Window {
        Intercom: any
    }
}
