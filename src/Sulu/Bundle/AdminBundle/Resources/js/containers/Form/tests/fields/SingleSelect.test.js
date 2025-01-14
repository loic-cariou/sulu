// @flow
import React from 'react';
import {shallow} from 'enzyme';
import {observable} from 'mobx';
import fieldTypeDefaultProps from '../../../../utils/TestHelper/fieldTypeDefaultProps';
import ResourceStore from '../../../../stores/ResourceStore';
import FormInspector from '../../FormInspector';
import ResourceFormStore from '../../stores/ResourceFormStore';
import SingleSelect from '../../fields/SingleSelect';

jest.mock('../../../../stores/ResourceStore', () => jest.fn());
jest.mock('../../stores/ResourceFormStore', () => jest.fn());
jest.mock('../../FormInspector', () => jest.fn());

test('Pass props correctly to SingleSelect', () => {
    const formInspector = new FormInspector(new ResourceFormStore(new ResourceStore('test'), 'test'));
    const schemaOptions = observable({
        values: {
            name: 'values',
            value: [
                {
                    name: 'mr',
                    title: 'Mister',
                },
                {
                    name: 'ms',
                    title: 'Miss',
                },
            ],
        },
    });
    const singleSelect = shallow(
        <SingleSelect
            {...fieldTypeDefaultProps}
            disabled={true}
            formInspector={formInspector}
            schemaOptions={schemaOptions}
            value="test"
        />
    );

    expect(singleSelect.prop('value')).toBe('test');
    expect(singleSelect.prop('disabled')).toBe(true);
    expect(singleSelect.find('Option').at(0).props()).toEqual(expect.objectContaining({
        value: 'mr',
        children: 'Mister',
    }));
    expect(singleSelect.find('Option').at(1).props()).toEqual(expect.objectContaining({
        value: 'ms',
        children: 'Miss',
    }));
});

test('Pass value if no title is given to SingleSelect', () => {
    const formInspector = new FormInspector(new ResourceFormStore(new ResourceStore('test'), 'test'));
    const schemaOptions = observable({
        values: {
            name: 'values',
            value: [
                {
                    name: 'mr',
                },
                {
                    name: 'ms',
                },
            ],
        },
    });
    const singleSelect = shallow(
        <SingleSelect
            {...fieldTypeDefaultProps}
            formInspector={formInspector}
            schemaOptions={schemaOptions}
        />
    );

    expect(singleSelect.find('Option').at(0).props()).toEqual(expect.objectContaining({
        value: 'mr',
        children: 'mr',
    }));
    expect(singleSelect.find('Option').at(1).props()).toEqual(expect.objectContaining({
        value: 'ms',
        children: 'ms',
    }));
});

test('Pass undefined as option-value if value with empty name is given to SingleSelect', () => {
    const formInspector = new FormInspector(new ResourceFormStore(new ResourceStore('test'), 'test'));
    const schemaOptions = observable({
        values: {
            name: 'values',
            value: [
                {
                    name: '',
                    title: 'No Selection',
                },
                {
                    name: 'ms',
                    title: 'Miss',
                },
            ],
        },
    });
    const singleSelect = shallow(
        <SingleSelect
            {...fieldTypeDefaultProps}
            formInspector={formInspector}
            schemaOptions={schemaOptions}
        />
    );

    expect(singleSelect.find('Option').at(0).props()).toEqual(expect.objectContaining({
        value: undefined,
        children: 'No Selection',
    }));
    expect(singleSelect.find('Option').at(1).props()).toEqual(expect.objectContaining({
        value: 'ms',
        children: 'Miss',
    }));
});

test('Should throw an exception if defaultValue is of wrong type', () => {
    const formInspector = new FormInspector(new ResourceFormStore(new ResourceStore('test'), 'test'));
    const schemaOptions = {
        default_value: {
            name: 'default_value',
            value: [],
        },
        values: {
            name: 'values',
            value: [
                {
                    name: 'mr',
                    title: 'Mister',
                },
                {
                    name: 'ms',
                    title: 'Miss',
                },
            ],
        },
    };

    expect(() => shallow(
        <SingleSelect
            {...fieldTypeDefaultProps}
            formInspector={formInspector}
            schemaOptions={schemaOptions}
        />
    )).toThrow(/"default_value"/);
});

test('Should throw an exception if value is of wrong type', () => {
    const formInspector = new FormInspector(new ResourceFormStore(new ResourceStore('test'), 'test'));
    const schemaOptions = {
        values: {
            name: 'values',
            value: [
                {
                    name: [],
                    title: 'Mister',
                },
                {
                    name: 'ms',
                    title: 'Miss',
                },
            ],
        },
    };

    expect(() => shallow(
        <SingleSelect
            {...fieldTypeDefaultProps}
            formInspector={formInspector}
            schemaOptions={(schemaOptions: any)}
        />
    )).toThrow(/"values"/);
});

test('Should call onFinish callback on every onChange', () => {
    const formInspector = new FormInspector(new ResourceFormStore(new ResourceStore('test'), 'test'));
    const finishSpy = jest.fn();
    const schemaOptions = {
        values: {
            name: 'values',
            value: [
                {
                    name: 'mr',
                    title: 'Mister',
                },
                {
                    name: 'ms',
                    title: 'Miss',
                },
            ],
        },
    };

    const singleSelect = shallow(
        <SingleSelect
            {...fieldTypeDefaultProps}
            formInspector={formInspector}
            onFinish={finishSpy}
            schemaOptions={schemaOptions}
        />
    );

    singleSelect.simulate('change');

    expect(finishSpy).toBeCalledWith();
});

test('Default value of null should not call onChange', () => {
    const formInspector = new FormInspector(new ResourceFormStore(new ResourceStore('test'), 'test'));
    const changeSpy = jest.fn();
    const schemaOptions = {
        default_value: {
            name: 'default_value',
            value: null,
        },
        values: {
            name: 'values',
            value: [
                {
                    name: 'mr',
                    title: 'Mister',
                },
            ],
        },
    };
    shallow(
        <SingleSelect
            {...fieldTypeDefaultProps}
            formInspector={formInspector}
            onChange={changeSpy}
            schemaOptions={schemaOptions}
        />
    );

    expect(changeSpy).not.toBeCalled();
});

test('Default value of empty string should not call onChange', () => {
    const formInspector = new FormInspector(new ResourceFormStore(new ResourceStore('test'), 'test'));
    const changeSpy = jest.fn();
    const schemaOptions = {
        default_value: {
            name: 'default_value',
            value: '',
        },
        values: {
            name: 'values',
            value: [
                {
                    name: 'mr',
                    title: 'Mister',
                },
            ],
        },
    };
    shallow(
        <SingleSelect
            {...fieldTypeDefaultProps}
            formInspector={formInspector}
            onChange={changeSpy}
            schemaOptions={schemaOptions}
        />
    );

    expect(changeSpy).not.toBeCalled();
});

test('Set default value if no value is passed', () => {
    const formInspector = new FormInspector(new ResourceFormStore(new ResourceStore('test'), 'test'));
    const changeSpy = jest.fn();
    const schemaOptions = {
        default_value: {
            name: 'default_value',
            value: 'mr',
        },
        values: {
            name: 'values',
            value: [
                {
                    name: 'mr',
                    title: 'Mister',
                },
                {
                    name: 'ms',
                    title: 'Miss',
                },
            ],
        },
    };
    shallow(
        <SingleSelect
            {...fieldTypeDefaultProps}
            formInspector={formInspector}
            onChange={changeSpy}
            schemaOptions={schemaOptions}
        />
    );

    expect(changeSpy).toBeCalledWith('mr');
});

test('Allow to pass one value for undefined', () => {
    const formInspector = new FormInspector(new ResourceFormStore(new ResourceStore('test'), 'test'));
    const changeSpy = jest.fn();
    const schemaOptions = {
        values: {
            name: 'values',
            value: [
                {
                    name: undefined,
                    title: 'None selected',
                },
                {
                    name: 'mr',
                    title: 'Mister',
                },
                {
                    name: 'ms',
                    title: 'Miss',
                },
            ],
        },
    };

    const singleSelect = shallow(
        <SingleSelect
            {...fieldTypeDefaultProps}
            formInspector={formInspector}
            onChange={changeSpy}
            // $FlowFixMe
            schemaOptions={schemaOptions}
        />
    );

    expect(singleSelect.find('Option').at(0).prop('value')).toBeUndefined();
});

test('Set default value to a number of 0 should work', () => {
    const formInspector = new FormInspector(new ResourceFormStore(new ResourceStore('test'), 'test'));
    const changeSpy = jest.fn();
    const schemaOptions = {
        default_value: {
            name: 'default_value',
            value: 0,
        },
        values: {
            name: 'values',
            value: [
                {
                    name: 0,
                    title: 'Mister',
                },
                {
                    name: 1,
                    title: 'Miss',
                },
            ],
        },
    };
    shallow(
        <SingleSelect
            {...fieldTypeDefaultProps}
            formInspector={formInspector}
            onChange={changeSpy}
            schemaOptions={schemaOptions}
        />
    );

    expect(changeSpy).toBeCalledWith(0);
});

test('Throw error if no values option is passed', () => {
    const formInspector = new FormInspector(new ResourceFormStore(new ResourceStore('test'), 'test'));
    expect(() => shallow(
        <SingleSelect
            {...fieldTypeDefaultProps}
            formInspector={formInspector}
        />)
    ).toThrow(/"values"/);
});

test('Throw error if values option with wrong type is passed', () => {
    const formInspector = new FormInspector(new ResourceFormStore(new ResourceStore('test'), 'test'));
    expect(() => shallow(
        <SingleSelect
            {...fieldTypeDefaultProps}
            formInspector={formInspector}
            schemaOptions={{values: {name: 'values', value: true}}}
        />)
    ).toThrow(/"values"/);
});
