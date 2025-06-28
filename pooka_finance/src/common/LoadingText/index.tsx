import "./styles.scss";

export const LoadingText=({
    text,
    size
}:{
    text:string,
    size:number
})=>{
    return <div className="zero-value" style={{
        fontSize:`${size}px`
    }}>
        {text}
    </div>
}