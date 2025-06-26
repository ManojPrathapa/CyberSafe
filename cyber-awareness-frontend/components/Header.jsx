export default function Header({ page }) {
  return (
    <div className="...">
      <h1>CYBERSAFE</h1>
      <div className="...">
        <Link href="/"><button>HOME</button></Link>
        {page === "signup" && <Link href="/login"><button>LOGIN</button></Link>}
        {page === "login" && <Link href="/signup"><button>SIGNUP</button></Link>}
        {page !== "login" && page !== "signup" && (
          <>
            <Link href="/login"><button>LOGIN</button></Link>
            <Link href="/signup"><button>SIGNUP</button></Link>
          </>
        )}
      
      </div>
    </div>
  );
}
