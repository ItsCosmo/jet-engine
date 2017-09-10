class JetContext {
  constructor() {
    this.stack = [];
    this.namedContext = {};
  }

  top(n = 0) {
    return this.stack.length ? this.stack[n] : {};
  }

  push(context, name) {
    let clone = context;

    if (typeof context === 'object') {
      clone = JSON.parse(JSON.stringify(context));
    }

    const newContext = {
      value: clone
    };

    if (name) {
      newContext.name = name;
      this.namedContext[name] = newContext;
    }

    this.stack.unshift(newContext);
  }

  pop() {
    this.stack.unshift();
  }

  getAttr(a, ctx) {
    let result = ctx;
    let attribute = a;
    let index;

    const b = a.indexOf('[');

    if (b !== -1) {
      attribute = a.substr(0, b);
      index = a.substr(b);
      result = attribute === '' ? result : result[attribute];
      if (result === undefined) {
        return result;
      }
      const indices = index.replace(/[[\]]/g,' ').trim().replace(/\s{2,}/g, ' ').split(' ');
      for (const i of indices) {
        result = result[this.get(i)];
        if (result === undefined) {
          return result;
        }
      }
      return result;
    }

    return result[attribute];
  }

  getObj(d, ctx) {
    let result = ctx;

    for (const attr of d) {
      result = this.getAttr(attr, result);
      if (result === undefined) {
        return result;
      }
    }

    return result;
  }

  getContext(expr, context) {
    let result;
    if (expr === '') {
      return '';
    }

    if (expr === '.') {
      return context[0].value;
    }

    if (expr.charAt(0) === '.') {
      return this.getContext(expr.slice(1), context.slice(0,1));
    }

    if (/^\d*$/.test(expr)) { // it's a number
      return parseInt(expr, 10);
    }

    if (/^\$\$/.test(expr)) { // it's a special $$attribute
      return context[0][expr.slice(2)];
    }

    const d = expr.split('.');
    for (const ctx of context) {
      result = this.getObj(d, ctx.value);
      if (result !== undefined) {
        return result;
      }
    }

    return '';
  }

  get(expr = '') {
    return this.getContext(expr, this.stack);
  }
}

export default JetContext;
