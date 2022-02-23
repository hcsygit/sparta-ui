import { mount, shallowMount } from '@vue/test-utils'
import Select from 'sparta/components/select'
import { createTest, createVue, destroyVM } from '../../util';

const getTestData = function() {
  return [
    { id: 1, name: 'cat' },
    { id: 2, name: 'dog' },
    { id: 3, name: 'pig' },
    { id: 4, name: 'tiger' },
    { id: 5, name: 'elephant' }
  ];
};

describe('Select', () => {

})