import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import StanceText from '../stance-text';
import TopicWrapper from '../topic-wrapper';
import {Button, IconButton, Typography} from '@material-ui/core';
import {FaRegComments, FaRegStar, FaStar} from 'react-icons/fa';
import {FiLink} from 'react-icons/fi';
import {Link} from 'gatsby';
import {useLanguage} from '../../utils/language';
import {useToggle} from 'react-use';

export default function TopicSection(props) {
  const {localize} = useLanguage();
  const [expanded, toggleExpanded] = useToggle(false);
  const hash = `#${props.topic.slug}`;
  return (
    <TopicWrapper topic={props.topic}>
      {props.stances ? (
        <Fragment>
          {props.stances.slice(0, expanded ? undefined : 1).map(stance => (
            <Typography key={stance.id} paragraph>
              <StanceText
                stance={stance}
                sources={props.sources}
                onSourceClick={props.onSourceClick}
              />
            </Typography>
          ))}
          <IconButton
            onClick={props.onStarClick}
            color="inherit"
            style={{
              marginLeft: -8
            }}
          >
            {props.starred ? <FaStar /> : <FaRegStar />}
          </IconButton>
          <IconButton
            component="a"
            onClick={() => props.onLinkClick(hash)}
            href={hash}
            color="inherit"
          >
            <FiLink />
          </IconButton>
          <IconButton
            component={Link}
            to={`/elections/${props.electionSlug}/topics#${props.topic.slug}`}
            color="inherit"
          >
            <FaRegComments />
          </IconButton>
          {props.stances.length > 1 && (
            <Button onClick={toggleExpanded} style={{marginLeft: 8}}>
              {expanded
                ? localize('Show less', 'Montre moins')
                : `${localize('Show more', 'Montre plus')} (${props.stances
                    .length - 1})`}
            </Button>
          )}
        </Fragment>
      ) : (
        <Typography paragraph>
          {localize(
            'No official stance has been taken on this topic.',
            "Aucune position officielle n'a été prise sur ce sujet."
          )}
        </Typography>
      )}
    </TopicWrapper>
  );
}

TopicSection.propTypes = {
  topic: PropTypes.object.isRequired,
  electionSlug: PropTypes.string.isRequired,
  onStarClick: PropTypes.func.isRequired,
  onLinkClick: PropTypes.func.isRequired,
  starred: PropTypes.bool.isRequired,
  sources: PropTypes.array.isRequired,
  onSourceClick: PropTypes.func.isRequired,
  stances: PropTypes.array
};
