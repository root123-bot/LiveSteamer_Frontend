import Head from 'next/head'
import styles from '../static/css/navbar.module.css'
import { Button } from 'semantic-ui-react'
import NavItem from './UI/NavBarItem';
import Router from 'next/router';

function NavBar({whatToToggle}) {

    return (
        <div>
           <Head>
            <title>SOKA MUBASHARA</title>
            <link
              rel="stylesheet"
              href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
              integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
              crossOrigin="anonymous"
            />
            <link
              rel="stylesheet"
              href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
            ></link>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          <div className={styles.topDiv}>
            <div className={styles.innerDiv}>
            {/* <span className={styles.logo}>SOCCER MUBASHARA</span> */}
            <div className={styles.logo} onClick={() => Router.push('/')}>
                <img src='../static/images/logo.png' width={50} height={50} />
            </div>
            <div className={styles.inlineDiv}>
                <NavItem icon='../static/images/database.png' title='Assets' whatToToggle='assets' />
                <NavItem icon='../static/images/football.png' title='match' whatToToggle='match' />
                <NavItem icon='../static/images/theme.png' title='Theme' whatToToggle='theme' />
                <div className={styles.btn}>
                    <Button color='black' content='Live Match' icon='rss' />
                </div>
            </div>
            </div>
          </div>
        </div>
    )
}

export default NavBar;