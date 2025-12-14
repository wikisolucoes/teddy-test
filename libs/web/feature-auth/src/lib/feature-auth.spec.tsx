import { render } from '@testing-library/react';

import TeddyMonorepoWebFeatureAuth from './feature-auth';

describe('TeddyMonorepoWebFeatureAuth', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TeddyMonorepoWebFeatureAuth />);
    expect(baseElement).toBeTruthy();
  });
});
