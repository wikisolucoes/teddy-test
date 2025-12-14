import { render } from '@testing-library/react';

import TeddyMonorepoWebCore from './web';

describe('TeddyMonorepoWebCore', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TeddyMonorepoWebCore />);
    expect(baseElement).toBeTruthy();
  });
});
