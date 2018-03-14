import React from 'react';
import path from 'path';
import { expect } from 'chai';

import { StaticContentRouter } from '../../middlewares/StaticContentRouter.jsx';

import { renderComponent } from '../../lib/helper.jsx';
import { mockCtx } from '../../lib/testHelpers.jsx';

describe('StaticContentRouter Middleware', () => {
  let ctx;

  const FILE_EXISTS_URL = '/test.txt';
  const FILE_DOESNT_EXIST_URL = '/doesnt/exist.txt';

  const STATIC_DIRECTORY = './tests/middlewares/public';

  const scRouter = config => () => (
    <StaticContentRouter
      {...ctx}
      dir={STATIC_DIRECTORY}
      hasPrefix={false}
      compress={true}
      {...config}
    />
  );

  // Static file routing without file url prefixing
  describe('Static routing without prefix', () => {
    it('should send the correct file', () => {
      ctx = mockCtx(FILE_EXISTS_URL);

      renderComponent(scRouter());

      // Should be a terminal node
      expect(ctx.calledTarget).to.exist;
      expect(ctx.calledTarget.hasTerminated).to.be.true;

      // Should call sendFile
      expect(ctx.calledFn).to.eql('response.sendFile');

      // Should call sendFile with this path
      expect(ctx.calledWith).to.eql(
        path.resolve(STATIC_DIRECTORY + FILE_EXISTS_URL),
      );
    });

    it('should do nothing when no file matches', () => {
      ctx = mockCtx(FILE_DOESNT_EXIST_URL);

      renderComponent(scRouter());

      // Shouldn't call anything
      expect(ctx.calledTarget).to.not.exist;
      expect(ctx.calledFn).to.not.exist;
      expect(ctx.calledWith).to.not.exist;
    });
  });
});
