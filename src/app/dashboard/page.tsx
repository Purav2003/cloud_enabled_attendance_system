// import Navbar from "../navbar";
import Navbar from "../navbar"
import Footer from '../footer'
export default function Dashboard(){
    return(
<div className="flex flex-col h-screen justify-between"> 
        <Navbar />
        <div>
            <div>
                <h1 className="flex justify-center items-center text-[40px] font-bold">Dashboard</h1>
            </div>
        </div>
        <Footer />
</div>

    )
}