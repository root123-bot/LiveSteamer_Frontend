import styles from '../../static/css/item.module.css'
import Router, { useRouter } from "next/router";

function NavItem({icon, clickHandler, whatToToggle, title}) {
    const router = useRouter() // https://nextjs.org/docs/api-reference/next/router#userouter
    
    {/* hii condition maanake endapo title and isToggled on is the same together with active link is the same to mean we're now in target page we want to change then it should do those changes... */}
    return ( 
        <div onClick={() => Router.push(`/${title.toLowerCase()}`)} className={styles.other} style={whatToToggle.toLowerCase() === title.toLowerCase() && router.pathname === `/${whatToToggle}` ? {color: '#DD3838'} : null }>
            <img src={whatToToggle.toLowerCase() === title.toLowerCase() && router.pathname === `/${whatToToggle}` ? `../../static/images/${title.toLowerCase()}-on.png` : icon } width={22} height={22} />
            <span className={styles.mini}>{title === 'match' ? 'Matches' : title}</span>
        </div>
    )
}

export default NavItem