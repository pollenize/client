import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ButtonBase from '@material-ui/core/ButtonBase';
import ElectionHeader from '../election-header';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Topic from './topic';
import Typography from '@material-ui/core/Typography';
import find from 'lodash/find';
import justin from '../../../assets/images/justin.jpg';
import prependHttp from 'prepend-http';
import styled from 'react-emotion';
import withProps from 'recompose/withProps';
import theme from '../../../theme';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {getCandidates} from '../../../selectors';

const Hero = styled.div({
  padding: theme.spacing.unit * 5,
  textAlign: 'center',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundBlendMode: 'multiply'
});

const StyledLink = styled(Link)({
  textDecoration: 'none'
});

const Container = styled.div({
  display: 'flex',
  flexGrow: 1,
  position: 'relative'
});

const sectionVerticalPadding = theme.spacing.unit * 5;
const sectionHorizontalPadding = theme.spacing.unit * 6;
const Section = styled.div({
  padding: `${sectionVerticalPadding}px ${sectionHorizontalPadding}px`
});

const sidebarVerticalPadding = theme.spacing.unit * 3;
const Sidebar = styled.aside({
  width: 200,
  padding: `${sidebarVerticalPadding}px ${theme.spacing.unit * 4}px`
});

const SidebarContainer = styled.div({
  display: 'flex',
  alignSelf: 'flex-start',
  justifyContent: 'flex-end',
  flexGrow: 1,
  marginTop: sectionVerticalPadding - sidebarVerticalPadding,
  position: 'sticky',
  top: theme.mixins.toolbar.height
});

const Content = styled.div({
  width: '100%',
  maxWidth: 960,
  borderLeft: `1px solid ${theme.palette.grey[100]}`,
  backgroundColor: theme.palette.background.paper
});

const FootnotesSection = styled(Section)({
  backgroundColor: theme.palette.grey[100]
});

const Footnotes = styled.ol({
  margin: 0,
  padding: 0,
  paddingLeft: theme.spacing.unit * 2
});

const Footnote = withProps({component: 'li'})(
  styled(Typography)({
    display: 'list-item'
  })
);

const Spacer = styled.div({
  flexGrow: 1,
  backgroundColor: theme.palette.background.paper
});

class Candidate extends Component {
  static propTypes = {
    candidate: PropTypes.object.isRequired,
    election: PropTypes.object.isRequired
  };

  scrollToTopic = slug => {
    const element = this.content.querySelector(`#${slug}`);
    const rect = element.getBoundingClientRect();
    window.scrollTo(
      0,
      rect.top +
        window.scrollY -
        theme.mixins.toolbar.height -
        sectionVerticalPadding
    );
  };

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>{this.props.candidate.name}</title>
        </Helmet>
        <ElectionHeader>
          <StyledLink to={`/elections/${this.props.election.slug}`}>
            {this.props.election.title}
          </StyledLink>
          <ChevronRightIcon />
          {this.props.candidate.name}
        </ElectionHeader>
        <Hero
          style={{
            color: theme.palette.getContrastText(this.props.candidate.color),
            backgroundImage: `url(${justin})`,
            backgroundColor: this.props.candidate.color
          }}
        >
          <Typography variant="display1" color="inherit">
            {this.props.candidate.name}
          </Typography>
          <Typography variant="subheading" color="inherit">
            {this.props.candidate.party}
          </Typography>
        </Hero>
        <Container>
          <SidebarContainer>
            <Sidebar>
              <Typography gutterBottom variant="caption">
                Topics
              </Typography>
              {this.props.election.topics.map(topic => (
                <Typography
                  gutterBottom
                  key={topic.id}
                  component={ButtonBase}
                  onClick={() => this.scrollToTopic(topic.slug)}
                  variant="subheading"
                >
                  {topic.title}
                </Typography>
              ))}
            </Sidebar>
          </SidebarContainer>
          <Content innerRef={node => (this.content = node)}>
            {this.props.election.topics.map(topic => (
              <Section key={topic.id}>
                <Topic
                  topic={topic}
                  candidate={this.props.candidate}
                  positions={this.props.candidate.positions[topic.slug]}
                />
              </Section>
            ))}
            <FootnotesSection>
              <Typography gutterBottom variant="title" id="sources">
                Sources
              </Typography>
              <Footnotes>
                {this.props.candidate.sources.map((source, index, array) => (
                  <Footnote
                    gutterBottom={index < array.length - 1}
                    key={source.id}
                  >
                    <a
                      href={prependHttp(source.url)}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {source.url}
                    </a>
                  </Footnote>
                ))}
              </Footnotes>
            </FootnotesSection>
          </Content>
          <Spacer />
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const candidates = getCandidates(state);
  return {
    candidate: find(candidates, ['slug', ownProps.match.params.id]),
    election: state.election.data
  };
};

export default connect(mapStateToProps)(Candidate);
