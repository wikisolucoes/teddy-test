import { render } from '@testing-library/react';

import TeddyMonorepoWebFeatureClients from './feature-clients';

describe('TeddyMonorepoWebFeatureClients', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TeddyMonorepoWebFeatureClients />);
    expect(baseElement).toBeTruthy();
  });
});
