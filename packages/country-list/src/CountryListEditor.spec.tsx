import * as React from 'react';
import selectEvent from 'react-select-event';

import { createFakeFieldAPI, createFakeLocalesAPI } from '@contentful/field-editor-test-utils';
import '@testing-library/jest-dom/extend-expect';
import { RenderResult, cleanup, configure, render } from '@testing-library/react';

import { CountryListEditor } from './CountryListEditor';

configure({
  testIdAttribute: 'data-test-id',
});

describe('CountryListEditor', () => {
  afterEach(cleanup);

  function expectInputValue({ getByRole }: RenderResult, expected: string) {
    const $input = getByRole('combobox');
    expect($input).toHaveValue(expected);
  }

  function changeInputValue({ getByRole }: RenderResult, value: string) {
    const $input = getByRole('combobox');
    selectEvent.select($input, value);
  }

  it('renders empty value properly', () => {
    const [field] = createFakeFieldAPI((mock) => {
      return {
        ...mock,
        validations: [],
      };
    });
    const renderResult = render(
      <CountryListEditor
        field={field}
        locales={createFakeLocalesAPI()}
        isInitiallyDisabled={false}
      />
    );

    expectInputValue(renderResult, '');
  });

  it.skip('renders non-empty value properly', () => {
    const initialValue = 'CL, GL, KE'; //['CL', 'GL', 'KE'];

    const [field] = createFakeFieldAPI((mock) => {
      return {
        ...mock,
        validations: [],
      };
    }, initialValue);

    const renderResult = render(
      <CountryListEditor
        field={field}
        locales={createFakeLocalesAPI()}
        isInitiallyDisabled={false}
      />
    );

    expectInputValue(renderResult, 'CL, GL, KE');
  });

  it.skip('calls setValue and removeValue when user inputs data', () => {
    const [field] = createFakeFieldAPI((field) => {
      jest.spyOn(field, 'setValue');
      jest.spyOn(field, 'removeValue');
      return {
        ...field,
        validations: [],
      };
    });

    const renderResult = render(
      <CountryListEditor
        field={field}
        locales={createFakeLocalesAPI()}
        isInitiallyDisabled={false}
      />
    );

    changeInputValue(renderResult, 'CL');

    expect(field.setValue).toHaveBeenLastCalledWith(['CL']);

    changeInputValue(renderResult, 'CL, GL ,     KE');

    expectInputValue(renderResult, 'CL, GL, KE');
    expect(field.setValue).toHaveBeenLastCalledWith(['CL', 'GL', 'KE']);

    changeInputValue(renderResult, '');
    expect(field.removeValue).toHaveBeenCalledTimes(1);
    expect(field.setValue).toHaveBeenCalledTimes(2);
  });

  it.skip('keeps trailing commas', () => {
    const [field] = createFakeFieldAPI(
      (field) => {
        jest.spyOn(field, 'setValue');
        return {
          ...field,
          validations: [],
        };
      },
      ['CL']
    );

    const renderResult = render(
      <CountryListEditor
        field={field}
        locales={createFakeLocalesAPI()}
        isInitiallyDisabled={false}
      />
    );

    changeInputValue(renderResult, 'CL,');

    expect(field.setValue).toHaveBeenLastCalledWith(['CL']);
    expectInputValue(renderResult, 'CL,');
  });
});
