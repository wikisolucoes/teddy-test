import { render } from '@testing-library/react';

import TeddyMonorepoWebFeatureDashboard from './feature-dashboard';

describe('TeddyMonorepoWebFeatureDashboard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TeddyMonorepoWebFeatureDashboard />);
    expect(baseElement).toBeTruthy();
  });
});
