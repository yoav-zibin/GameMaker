import { shallow } from 'enzyme';
import * as React from 'react';
import SpecInfo from './SpecInfo';

it('should render correct value', () => {
  const props = {
    handleIcon50CLick: () => {},
    handleIcon512Click: () => {},
    handleGameIcon50: () => {},
    gameIcon50: [],
    gameIcon512: [],
    setYoutube: () => {},
    setWiki: () => {},
    getYoutube: () => {},
    getWiki: () => {},
    getGameIcon50: () => {},
    getGameIcon512: () => {}
  };

  const wrapper = shallow(
    <SpecInfo
      handleIcon50CLick={props.handleIcon50CLick}
      handleIcon512Click={props.handleIcon512Click}
      gameIcon50={props.gameIcon50}
      gameIcon512={props.gameIcon512}
      setYoutube={props.setYoutube}
      setWiki={props.setWiki}
      getYoutube={props.getYoutube}
      getWiki={props.getWiki}
      getGameIcon50={props.getGameIcon50}
      getGameIcon512={props.getGameIcon512}
    />
  );

  expect(wrapper.find('TextField').length).toBe(2);
  expect(wrapper.find('BoardList').length).toBe(0);
});
