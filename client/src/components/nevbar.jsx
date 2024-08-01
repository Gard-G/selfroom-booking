function Navbar() {
    return(
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top d-print-none">
            <div class="container">
                <a class="navbar-brand fontTH" href="//rmutp.ac.th">RMUTP</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse fontTH" id="navbarResponsive">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item active">
                            <a class="nav-link" href="/">
                                หน้าแรก
                                <span class="sr-only">(current)</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/booking">จองห้อง</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/approve">ลงนาม/อนุมัติ</a>
                        </li>
    
    
                            <li class="nav-item">
                                <a class="nav-link" href="/">เข้าสู่ระบบ</a>
                            </li>
                    </ul>
                </div>
            </div>
        </nav>
        )
    }
    export default Navbar;