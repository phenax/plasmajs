import React from 'react';

import { expect } from 'chai';

import { MiddleWare } from '../../MiddleWare';

import { renderComponent } from '../../lib/helper';
import { mockCtx } from '../../lib/testHelpers.jsx';

describe('Custom Middleware', () => {
  let wasCalled;

  let callback;

  let ctx;

  class MockMiddleWare extends MiddleWare {
    onRequest(req, res) {
      wasCalled = true;
      this.res = res;
      if (callback) callback(() => this.terminate());
    }
  }

  beforeEach(() => {
    wasCalled = false;

    ctx = mockCtx();
  });

  it('should call the onRequest method when rendered', () => {
    renderComponent(() => <MockMiddleWare {...ctx} />);

    expect(wasCalled).to.be.true;
  });

  it('should terminate when .terminate is called', () => {
    callback = terminate => terminate();

    renderComponent(() => <MockMiddleWare {...ctx} />);

    expect(ctx.calledTarget.hasTerminated).to.be.true;
  });

  it('should throw error when there is no onRequest method defined', () => {
    const onReqBackup = MockMiddleWare.prototype.onRequest;
    MockMiddleWare.prototype.onRequest = null;

    expect(() => renderComponent(() => <MockMiddleWare {...ctx} />)).to.throw(
      Error,
    );

    MockMiddleWare.prototype.onRequest = onReqBackup;
  });
});
