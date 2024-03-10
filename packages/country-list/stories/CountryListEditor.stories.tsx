import * as React from 'react';

import {
  ActionsPlayground,
  createFakeFieldAPI,
  createFakeLocalesAPI,
} from '@contentful/field-editor-test-utils';
import type { Meta, StoryObj } from '@storybook/react';

import { CountryListEditor } from '../src/CountryListEditor';

const meta: Meta<typeof CountryListEditor> = {
  title: 'editors/CountryList',
  component: CountryListEditor,
};

export default meta;

type Story = StoryObj<typeof CountryListEditor>;

export const Default: Story = {
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
  render: () => {
    const [field, mitt] = createFakeFieldAPI();
    return (
      <div>
        <CountryListEditor
          field={field}
          locales={createFakeLocalesAPI()}
          isInitiallyDisabled={false}
        />
        <ActionsPlayground mitt={mitt} />
      </div>
    );
  },
};

export const List: Story = {
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
  render: () => {
    const [field] = createFakeFieldAPI((mock) => mock, ['CL', 'GL', 'KE']);
    return (
      <CountryListEditor
        field={field}
        locales={createFakeLocalesAPI()}
        isInitiallyDisabled={false}
      />
    );
  },
};
