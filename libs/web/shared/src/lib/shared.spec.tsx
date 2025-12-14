import { render } from '@testing-library/react';

import TeddyMonorepoWebShared from './shared';

describe('TeddyMonorepoWebShared', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TeddyMonorepoWebShared />);
    expect(baseElement).toBeTruthy();
  });
});
