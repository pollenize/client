import Header from '../components/header';
import Layout from '../components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Box,
  Card,
  CardActionArea,
  Chip,
  Grid,
  Typography
} from '@material-ui/core';
import {Helmet} from 'react-helmet';
import {Link, graphql} from 'gatsby';
import {styled, useTheme} from '@material-ui/styles';

const StyledCard = styled(Card)(({theme}) => ({
  backgroundColor: theme.palette.grey[200]
}));

export default function Elections(props) {
  const {breakpoints, spacing} = useTheme();
  return (
    <Layout>
      <Helmet>
        <title>Elections</title>
      </Helmet>
      <Header />
      <Box width={1} maxWidth={breakpoints.values.lg} p={8} mx="auto">
        <Typography gutterBottom variant="h2">
          Elections
        </Typography>
        <Grid container spacing={3}>
          {props.data.pollenize.elections.map(election => {
            const endsAt = new Date(Number(election.endsAt));
            const isActive = endsAt > Date.now() - 1000 * 60 * 60 * 24 * 365;
            return (
              <Grid item xs={3} key={election.id}>
                <StyledCard elevation={0}>
                  <CardActionArea
                    component={Link}
                    to={`/elections/${election.slug}`}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      p={4}
                    >
                      <img
                        height={32}
                        src={election.flag}
                        style={{marginBottom: spacing(2)}}
                      />
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
                </StyledCard>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Layout>
  );
}

Elections.propTypes = {
  data: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  {
    pollenize {
      elections {
        id
        slug
        title
        flag
        endsAt
      }
    }
  }
`;
