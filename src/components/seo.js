import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';

export default function SEO(props) {
  const imageUrl = `https://pollenize.org/social/${props.slug}.png`;
  return (
    <Helmet>
      <html lang={props.lang} />
      <title>{props.title}</title>
      <meta name="og:image" content={imageUrl} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired
};