import JetContext from '../src/context';

describe('The Jet Context', () => {
  it('should start with an empty stack', () => {
    const ctx = new JetContext();

    expect(ctx.namedContext).toEqual({});
    expect(ctx.stack).toEqual([]);
  });

  it('should allow a named context to be pushed', () => {
    const ctx = new JetContext();

    ctx.push({ name: 'John' }, 'inner');

    expect(ctx.namedContext).toEqual(expect.objectContaining({
      'inner': expect.anything(),
    }));
  });

  it('should get empty attribute', () => {
    const ctx = new JetContext();

    ctx.push({ name: 'John' });

    expect(ctx.get()).toEqual('');
    expect(ctx.get('')).toEqual('');
  });

  it('should get an existing attribute', () => {
    const ctx = new JetContext();

    ctx.push({ name: 'John' });

    expect(ctx.get('name')).toEqual('John');
  });

  it('should get an non-existing attribute', () => {
    const ctx = new JetContext();

    ctx.push({ name: 'John' });

    expect(ctx.get('age')).toEqual('');
  });

  it('should get attribute within context stack', () => {
    const ctx = new JetContext();

    ctx.push({ name: 'John' });
    ctx.push({ age: 15 });

    expect(ctx.get('name')).toEqual('John');
    expect(ctx.get('age')).toEqual(15);
  });

  it('should get nested attribute', () => {
    const ctx = new JetContext();

    ctx.push({ person: { name: 'John', age: 15 } });
    ctx.push({ age: 15 });

    expect(ctx.get('person.name')).toEqual('John');
  });

  it('should get non-existing nested attribute', () => {
    const ctx = new JetContext();

    ctx.push({ person: { name: 'John', age: 15 } });
    ctx.push({ age: 15 });

    expect(ctx.get('person.height')).toEqual('');
  });

  it('should get non-existing deeply nested attribute', () => {
    const ctx = new JetContext();

    ctx.push({ person: { name: 'John', age: 15 } });
    ctx.push({ age: 15 });

    expect(ctx.get('person.height.inches')).toEqual('');
  });

  it('should get array attribute', () => {
    const ctx = new JetContext();

    ctx.push({ person: [{ name: 'John', age: 15 }, { name: 'Mary', age: 13 }] });

    expect(ctx.get('person[1].name')).toEqual('Mary');
  });

  it('should get nested array attribute', () => {
    const ctx = new JetContext();

    ctx.push({ person: { names: ['John', 'Orson'] } });

    expect(ctx.get('person.names[1]')).toEqual('Orson');
  });

  it('should get multiple array attribute', () => {
    const ctx = new JetContext();

    ctx.push({ person: { names: [['Humperdoo', 'Jackson'], ['Orson', 'Blair']] } });

    expect(ctx.get('person.names[0][0]')).toEqual('Humperdoo');
    expect(ctx.get('person.names[1][1]')).toEqual('Blair');
  });

  it('should get multiple array attribute within context', () => {
    const ctx = new JetContext();

    ctx.push({ person: { names: [['Humperdoo', 'Jackson'], ['Orson', 'Blair']] } });
    ctx.push({ age: 15 });

    expect(ctx.get('person.names[0][0]')).toEqual('Humperdoo');
    expect(ctx.get('person.names[1][1]')).toEqual('Blair');
  });

  it('should merge, not replace context', () => {
    const ctx = new JetContext();

    ctx.push({ person: { names: { first: 'First', middle: 'middle', last: 'Last' } } });
    ctx.push({ person: { names: { middle: 'Humperdoo' } } });
    ctx.push({ person: { names: {} } });
    ctx.push({ person: [1, 2, 3] });
    ctx.push({ auto: ['Mustang', 'Beetle'] });
    ctx.push({ auto: ['Corvette'] });

    expect(ctx.get('person.names.first')).toEqual('First');
    expect(ctx.get('person.names.middle')).toEqual('Humperdoo');
    expect(ctx.get('person[1]')).toEqual(2);
    expect(ctx.get('auto[0]')).toEqual('Corvette');
    expect(ctx.get('auto[1]')).toEqual('Beetle');
    expect(ctx.get('buffalo')).toEqual('');
  });

  it('should search up but not down', () => {
    const ctx = new JetContext();

    ctx.push({ foo: 'bar', one: { two: 'Hello!' } });
    ctx.push('level2');

    expect(ctx.get('one')).toEqual({ two: 'Hello!' });
    expect(ctx.get('two')).toEqual('');
  });

  it('should return current context', () => {
    const ctx = new JetContext();

    ctx.push('thing');
    expect(ctx.get('.')).toEqual('thing');

    ctx.push(3);
    expect(ctx.get('.')).toEqual(3);

    ctx.push({ name: 'dave' });
    expect(ctx.get('.')).toEqual({ name: 'dave' });
  });

  it('should return attribute from top context only', () => {
    const ctx = new JetContext();

    ctx.push({ person: { name: 'Jim', age: 30 } });
    ctx.push({ person: { age: 20 } });
    expect(ctx.get('person.name')).toEqual('Jim');
    expect(ctx.get('person.age')).toEqual(20);
    expect(ctx.get('.person.name')).toEqual('');
    expect(ctx.get('.person.age')).toEqual(20);
  });

  it('should evaluate index from context', () => {
    const ctx = new JetContext();

    ctx.push({ names: ['Tulip', 'Jessica'], age: 20 });
    ctx.push({ num: 1 });

    expect(ctx.get('num')).toEqual(1);
    expect(ctx.get('names[num]')).toEqual('Jessica');
  });

  it('should evaluate property from context', () => {
    const ctx = new JetContext();

    ctx.push({ name: { first: 'Abraham', middle: 'Humperdoo', last: 'Lincoln' }, age: 20 });
    ctx.push({ prop1: 'age', prop2: 'middle' });

    expect(ctx.get('[prop1]')).toEqual(20);
    expect(ctx.get('name[prop2]')).toEqual('Humperdoo');
  });

  it('should return special value $$name', () => {
    const ctx = new JetContext();

    ctx.push({ name: { first: 'Abraham', middle: 'Humperdoo', last: 'Lincoln' }, age: 20 }, 'pow');

    expect(ctx.get('$$name')).toEqual('pow');
  });

  it('should return empty object', () => {
    const ctx = new JetContext();

    ctx.push({ names: ['Kitty', 'Joe'] });

    expect(ctx.get('names[0]')).toEqual('Kitty');
    expect(ctx.get('names[3]')).toEqual('');
  });
});