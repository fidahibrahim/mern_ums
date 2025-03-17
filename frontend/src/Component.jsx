

function FormText(){
    return(
        <form>
            <input type="text" value={text} placeholder="text your name" />
            <button type="submit">submit</button>
        </form>
    )
}

function Greet(){
    return(
        <>
        <h1>Hello </h1>
        < FormText />
        </>
    )
}
export default Greet