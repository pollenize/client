import Footer from '../components/footer';
import Header from '../components/header';
import Layout from '../components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Box,
  Card,
  Chip,
  Divider,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import {CardActionArea} from 'gatsby-theme-material-ui';
import {Helmet} from 'react-helmet';
import {SectionWrapper} from '../components/common';
import {graphql} from 'gatsby';

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.palette.grey[200]
  },
  flag: {
    marginBottom: theme.spacing(2)
  }
}));

export default function Elections(props) {
  const {card, flag} = useStyles();
  return (
    <Layout>
      <Helmet>
        <title>Elections</title>
      </Helmet>
      <Header />
      <SectionWrapper>
        <Typography gutterBottom variant="h2">
          Elections
        </Typography>
        <Grid container spacing={3}>
          {props.data.pollenize.elections.map(election => {
            const endsAt = new Date(Number(election.endsAt));
            const isActive = endsAt > Date.now();
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={election.id}>
                <Card className={card} elevation={0}>
                  <CardActionArea
                    to={`/${election.language.code}/elections/${election.slug}`}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      p={4}
                    >
                      <img height={32} src={election.flag} className={flag} />
                      <Typography gutterBottom variant="h5" noWrap>
                        {election.title}
                      </Typography>
                      <Chip
                        size="small"
                        label={
                          isActive ? endsAt.toLocaleDateString() : 'Concluded'
                        }
                        variant={isActive ? 'default' : 'outlined'}
                        color={isActive ? 'primary' : 'default'}
                      />
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </SectionWrapper>
      <Divider />
      <Footer />
    </Layout>
  );
}

Elections.propTypes = {
  data: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  {
    pollenize {
      elections(public: true) {
        id
        slug
        title
        flag
        endsAt
        language {
          code
        }
      }
    }
  }
`;
