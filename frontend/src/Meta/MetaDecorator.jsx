import React from 'react'
import { Helmet } from "react-helmet";
const MetaDecorator = ({ title, description, imageAlt, url }) => {
    const imageUrl = ''
    return (
        <Helmet>
            {/* <!-- Primary Meta Tags --> */}
            <title>Artizia</title>
            <meta name="title" content="Artizia" />
            <meta name="description" content="Artizia" />

            {/* <!-- Open Graph / Facebook --> */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://artiziatwo.pluton.ltd/" />
            <meta property="og:title" content="Artizia" />
            <meta property="og:description" content="Artizia" />
            <meta property="og:image" content="https://static.licdn.com/sc/h/5bukxbhy9xsil5mb7c2wulfbx" />

            {/* <!-- Twitter --> */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content="https://artiziatwo.pluton.ltd/" />
            <meta property="twitter:title" content="Artizia" />
            <meta property="twitter:description" content="Artizia" />
            <meta property="twitter:image" content="https://static.licdn.com/sc/h/5bukxbhy9xsil5mb7c2wulfbx" />
            {/* <meta name="twitter:site" content={metaDecorator.twitterUsername} /> */}
        </Helmet>
    )
}

export default MetaDecorator