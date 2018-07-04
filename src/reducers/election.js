import api from '../api';
import findIndex from 'lodash/findIndex';
import reject from 'lodash/reject';
import {handleActions} from 'redux-actions';
import {loop, Cmd} from 'redux-loop';
import {load, success, failure, reset} from '../actions/election';
import {push} from 'react-router-redux';
import {
  success as candidateSuccess,
  removed as candidateRemoved
} from '../actions/candidate';
import {
  success as positionSuccess,
  removed as positionRemoved
} from '../actions/position';
import {
  success as topicSuccess,
  removed as topicRemoved
} from '../actions/topic';

async function fetchElection(id) {
  const response = await api.get(`/elections/${id}`);
  if (response.err) {
    throw response.body;
  }
  return response.body;
}

function replaceOrUpdate(collection = [], item) {
  const index = findIndex(collection, ['id', item.id]);
  if (index === -1) {
    return {
      result: [...collection, item],
      updated: false
    };
  }

  return {
    result: [
      ...collection.slice(0, index),
      item,
      ...collection.slice(index + 1)
    ],
    updated: true
  };
}

const defaultState = {
  loading: false,
  error: null,
  data: null
};

export default handleActions(
  {
    [load]: (state, {payload}) =>
      loop(
        {
          ...state,
          loading: true
        },
        Cmd.run(fetchElection, {
          successActionCreator: success,
          failActionCreator: failure,
          args: [payload]
        })
      ),
    [success]: (state, {payload}) => ({
      ...state,
      loading: false,
      error: null,
      data: payload
    }),
    [failure]: (state, {payload}) => ({
      ...state,
      loading: false,
      error: payload
    }),
    [candidateSuccess]: (state, {payload}) => {
      const {result, updated} = replaceOrUpdate(state.data.candidates, payload);
      const nextState = {
        ...state,
        data: {
          ...state.data,
          candidates: result
        }
      };

      if (updated) {
        const pathname = `/elections/${state.data.slug}/${payload.slug}`;
        if (pathname !== window.location.pathname) {
          return loop(nextState, Cmd.action(push(pathname)));
        }
      }

      return nextState;
    },
    [candidateRemoved]: (state, {payload}) =>
      loop(
        {
          ...state,
          data: {
            ...state.data,
            candidates: reject(state.data.candidates, ['id', payload.id])
          }
        },
        Cmd.action(push(`/elections/${state.data.slug}`))
      ),
    [positionSuccess]: (state, {payload}) => ({
      ...state,
      data: {
        ...state.data,
        candidates: state.data.candidates.map(candidate => {
          if (candidate.id !== payload.candidate_id) {
            return candidate;
          }

          const topic = payload.topic_id;
          const {positions} = candidate;
          const {result} = replaceOrUpdate(positions[topic], payload);
          return {
            ...candidate,
            positions: {
              ...positions,
              [topic]: result
            }
          };
        })
      }
    }),
    [positionRemoved]: (state, {payload}) => ({
      ...state,
      data: {
        ...state.data,
        candidates: state.data.candidates.map(candidate => {
          if (candidate.id !== payload.candidate_id) {
            return candidate;
          }

          const topic = payload.topic_id;
          const {positions} = candidate;
          return {
            ...candidate,
            positions: {
              ...positions,
              [topic]: reject(positions[topic], ['id', payload.id])
            }
          };
        })
      }
    }),
    [topicSuccess]: (state, {payload}) => {
      const {result} = replaceOrUpdate(state.data.topics, payload);
      return {
        ...state,
        data: {
          ...state.data,
          topics: result
        }
      };
    },
    [topicRemoved]: (state, {payload}) => ({
      ...state,
      data: {
        ...state.data,
        topics: reject(state.data.topics, ['id', payload.id])
      }
    }),
    [reset]: () => defaultState
  },
  defaultState
);
