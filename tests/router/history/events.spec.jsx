import constant from 'lodash/constant';
import { expect } from 'chai';

import {
  addRouteChangeListener,
  exposeRouteChangeListeners,
  removeRouteChangeListener,
  triggerUpdate,
} from '../../../router/history/events';

describe('Router', () => {
  describe('history', () => {
    describe('event handlers', () => {
      afterEach(() => {
        removeRouteChangeListener('test');
      });
      it('can add a trigger handler based on an id', () => {
        expect(addRouteChangeListener('test', constant(true))).to.be.true;
        expect(exposeRouteChangeListeners().has('test')).to.be.true;
      });
      it('will not clobber an existing trigger', () => {
        addRouteChangeListener('test', constant(true));
        expect(addRouteChangeListener('test', constant(false))).to.be.false;
        expect(exposeRouteChangeListeners().get('test')).to.be.a('function');
        expect(exposeRouteChangeListeners().get('test')()).to.be.true;
      });
      it('can remove an existing ID', () => {
        addRouteChangeListener('test', constant(true));
        expect(removeRouteChangeListener('test')).not.to.throw;
        expect(exposeRouteChangeListeners().has('test')).to.be.false;
      });
      it("don't care if the ID exists or not when removing", () => {
        addRouteChangeListener('test', constant(true));
        expect(removeRouteChangeListener('test')).not.to.throw;
        expect(exposeRouteChangeListeners().has('test')).to.be.false;
        expect(removeRouteChangeListener('foo')).not.to.throw;
        expect(exposeRouteChangeListeners().has('foo')).to.be.false;
      });
      it('will fire off all the handlers that are functions whenever updates are triggered', () => {
        addRouteChangeListener('foo', 2);
        addRouteChangeListener('bar', constant(3));
        addRouteChangeListener('baz', constant(4));
        addRouteChangeListener('test', constant(true));
        const updates = triggerUpdate();
        expect(updates)
          .to.be.an('array')
          .and.have.length(3);
        expect(updates).to.include(3);
        expect(updates).to.include(4);
        expect(updates).to.include(true);
      });
    });
  });
});
