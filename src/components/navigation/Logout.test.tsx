import { shallow } from 'enzyme';
import * as React from 'react';
import Logout from './Logout';

it('should logout properly', () => {
  let myMock = jest.fn();
  const wrapper = shallow(
    <Logout isAuthenticated={true} handleClick={myMock} />
  );
  const wrapper2 = shallow(
    <Logout isAuthenticated={false} handleClick={myMock} />
  );

  expect(wrapper.find('RaisedButton').length).toBe(1);
  wrapper
    .find('RaisedButton')
    .at(0)
    .simulate('click');
  expect(myMock.mock.calls.length).toBe(1);
  expect(wrapper2.find('RaisedButton').length).toBe(1);
});
