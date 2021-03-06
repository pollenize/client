import DrawerContent from './drawer-content';
import LanguageMenu from '../language-menu';
import PropTypes from 'prop-types';
import React, {Fragment, useMemo, useState} from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  Drawer,
  Grid,
  Hidden,
  IconButton,
  NoSsr,
  Tooltip,
  Typography,
  makeStyles
} from '@material-ui/core';
import {CardActionArea} from 'gatsby-theme-material-ui';
import {FaRegComments, FaStar, FaThLarge} from 'react-icons/fa';
import {FiInfo, FiMenu} from 'react-icons/fi';
import {Link} from 'gatsby';
import {upperFirst} from 'lodash';
import {useLanguage} from '../../utils/language';
import {useLocalStorage} from 'react-use';
import {useStars} from '../../utils/stars';

const useStyles = makeStyles(theme => ({
  paper: {
    width: 350,
    [theme.breakpoints.only('xs')]: {
      width: 300
    }
  },
  languageButton: {
    padding: theme.spacing(2),
    border: '1px solid currentColor',
    borderRadius: theme.shape.borderRadius
  }
}));

export default function ElectionMenu(props) {
  const {paper, languageButton} = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [introState, setIntroState] = useLocalStorage('intro', {});
  const [dialogOpen, setDialogOpen] = useState(!introState[props.electionSlug]);
  const {lang, languages, getPathForLanguage, localize} = useLanguage();
  const {stars, resetStars} = useStars();

  const totalStarCount = useMemo(
    () =>
      props.candidates.reduce((acc, candidate) => {
        const candidateStars = stars[candidate.id] || [];
        return acc + candidateStars.length;
      }, 0),
    [props.candidates, stars]
  );

  function openDrawer() {
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
  }

  function openDialog() {
    setDialogOpen(true);
    if (drawerOpen) {
      closeDrawer();
    }
  }

  function closeDialog() {
    if (!introState[props.electionSlug]) {
      setIntroState(prevState => ({
        ...prevState,
        [props.electionSlug]: true
      }));
    }

    setDialogOpen(false);
  }

  const electionPath = `/${lang}/elections/${props.electionSlug}`;

  return (
    <Fragment>
      {props.intro && (
        <Fragment>
          <Hidden only="xs" implementation="css">
            <IconButton color="inherit" onClick={openDialog}>
              <FiInfo />
            </IconButton>
          </Hidden>
          <Dialog fullWidth open={dialogOpen} onClose={closeDialog}>
            <DialogTitle disableTypography>
              <Typography variant="overline">
                {localize('Welcome to')}
              </Typography>
              <Typography variant="h4">Pollenize {props.title}</Typography>
            </DialogTitle>
            <Box p={3} pt={1}>
              <Typography paragraph>{props.intro}</Typography>
              <Typography
                paragraph
                display="block"
                color="textSecondary"
                variant="body2"
              >
                {localize('Select your preferred language')}:
              </Typography>
              <Grid container spacing={2}>
                {languages.map(({code, name}) => (
                  <Grid item xs={6} key={code}>
                    <Box color={code === lang ? 'primary.main' : 'inherit'}>
                      <CardActionArea
                        className={languageButton}
                        to={getPathForLanguage(code)}
                        onClick={closeDialog}
                      >
                        <Typography variant="h5">{upperFirst(code)}</Typography>
                        <Typography>{name}</Typography>
                      </CardActionArea>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Dialog>
        </Fragment>
      )}
      <Tooltip title={localize('Candidate grid')}>
        <IconButton
          component={Link}
          to={electionPath}
          color={props.active === 'grid' ? 'primary' : 'inherit'}
        >
          <FaThLarge style={{margin: 2}} size={20} />
        </IconButton>
      </Tooltip>
      <Tooltip title={localize('Topic explorer')}>
        <IconButton
          component={Link}
          to={`${electionPath}/topics`}
          color={props.active === 'topics' ? 'primary' : 'inherit'}
        >
          <FaRegComments />
        </IconButton>
      </Tooltip>
      {languages.length > 1 && (
        <Hidden only="xs" implementation="css">
          <LanguageMenu />
        </Hidden>
      )}
      <IconButton onClick={openDrawer} color="inherit">
        <Box display="flex" position="relative">
          <FiMenu />
          <NoSsr>
            {totalStarCount > 0 && (
              <Box
                size={16}
                component={FaStar}
                color="secondary.main"
                position="absolute"
                top={-5}
                right={-5}
              />
            )}
          </NoSsr>
        </Box>
      </IconButton>
      <Drawer
        classes={{paper}}
        anchor="right"
        onClose={closeDrawer}
        open={drawerOpen}
      >
        <DrawerContent
          candidates={props.candidates}
          electionPath={electionPath}
          title={props.title}
          partyFirst={props.partyFirst}
          onIntroClick={props.intro && openDialog}
          totalStarCount={totalStarCount}
          stars={stars}
          resetStars={resetStars}
        />
      </Drawer>
    </Fragment>
  );
}

ElectionMenu.propTypes = {
  title: PropTypes.string.isRequired,
  electionSlug: PropTypes.string.isRequired,
  candidates: PropTypes.array.isRequired,
  partyFirst: PropTypes.bool.isRequired,
  intro: PropTypes.string,
  active: PropTypes.string
};
