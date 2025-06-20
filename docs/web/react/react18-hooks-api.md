# React18 Hooks API

## 1. useState

**useState：** 定义变量，使其具备类组件的`state`，让函数式组件拥有更新视图的能力。

**基本使用：**

```ts
const [state, setState] = useState(initData);
```

**Params：**

- initData：默认初始值，有两种情况：函数和非函数，如果是函数，则函数的返回值作为初始值。

**Result：**

- state：数据源，用于渲染`UI` 层的数据源；
- setState：改变数据源的函数，可以理解为类组件的`this.setState`。

**基本使用：** 主要介绍两种`setState`的使用方法。

```tsx
import { useState } from 'react';
import { Button, Space } from 'antd';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>数字：{count}</div>
      <Space>
        <Button type='primary' onClick={() => setCount(count + 1)}>
          第一种方式+1
        </Button>
        <Button type='primary' onClick={() => setCount((v) => v + 1)}>
          第二种方式+1
        </Button>
      </Space>
    </>
  );
};

export default App;
```

**效果：**

<video src="/react/react18-hooks-api/setState01.mov" width="400" muted autoplay="autoplay" loop="loop"></video>

**注意：** `useState`有点类似于`PureComponent`，它会进行一个比较浅的比较，这就导致了一个问题，如果只是修改对象的某个属性，并不会实时更新。

```tsx
import { useState } from 'react';
import { Button } from 'antd';

const App = () => {
  const [obj01, setObj01] = useState({ number: 0 });
  const [obj02, setObj02] = useState({ number: 0 });

  return (
    <>
      <div>设置原对象：{obj01.number}</div>
      <Button
        type='primary'
        onClick={() => {
          obj01.number++;
          setObj01(obj01);
        }}
      >
        点击+1
      </Button>
      <div>设置新对象：{obj02.number}</div>
      <Button
        type='primary'
        onClick={() => {
          setObj02({ number: obj02.number + 1 });
        }}
      >
        点击+1
      </Button>
    </>
  );
};

export default App;
```

**效果：**

<video src="/react/react18-hooks-api/setState02.mov" width="400" muted autoplay="autoplay" loop="loop"></video>

## 2. useEffect

**useEffect：** 副作用，这个钩子成功弥补了函数式组件没有生命周期的缺陷，是我们最常用的钩子之一。

**基本使用：**

```tsx
useEffect(() => {
  return destory;
}, deps);
```

**Params：**

- callback：`useEffect`的第一个入参，最终返回`destory`，它会在下一次`callback`执行之前调用，其作用是清除上次的`callback`产生的副作用；
- deps：依赖项，可选参数，是一个数组，可以有多个依赖项，通过依赖去改变，执行上一次的`callback`返回的`destory`和新的`effect`第一个参数`callback`。

**模拟挂载和卸载阶段：**

事实上，`destory`会用在组件卸载阶段上，把它当作组件卸载时执行的方法就好，通常用于监听`addEventListener`和`removeEventListener`上，如：

```tsx
import { useState, useEffect } from 'react';
import { Button } from 'antd';

const Child = () => {
  useEffect(() => {
    console.log('挂载');

    return () => {
      console.log('卸载');
    };
  }, []);

  return <div>useEffect</div>;
};

const App = () => {
  const [flag, setFlag] = useState(false);

  return (
    <>
      <Button type='primary' onClick={() => setFlag((v) => !v)}>
        {flag ? '卸载' : '挂载'}
      </Button>
      {flag && <Child />}
    </>
  );
};

export default App;
```

**效果：**

<video src="/react/react18-hooks-api/setState03.mov" width="400" muted autoplay="autoplay" loop="loop"></video>

**依赖变化：**

`dep`的个数决定`callback`什么时候执行，如：

```tsx
import { useState, useEffect } from 'react';
import { Button } from 'antd';

const App = () => {
  const [number, setNumber] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('count改变才会执行');
  }, [count]);

  return (
    <>
      <div>
        number: {number} count: {count}
      </div>
      <Space>
        <Button type='primary' onClick={() => setNumber((v) => v + 1)}>
          number + 1
        </Button>
        <Button type='primary' onClick={() => setCount((v) => v + 1)}>
          count + 1
        </Button>
      </Space>
    </>
  );
};

export default App;
```

**效果：**

<video src="/react/react18-hooks-api/setState04.mov" width="400" muted autoplay="autoplay" loop="loop"></video>

**无限执行：**

当`useEffect`的第二个参数 deps 不存在时，会无限执行。更加准确地说，只要数据源发生变化，该函数都会执行，所以请不要这么做，否则会出现不可控的现象。

```tsx
import { useState, useEffect } from 'react';
import { Button } from 'antd';

const App = () => {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    console.log('Frank的文档');
  });

  return (
    <Space>
      <Button type='primary' onClick={() => setCount((v) => v + 1)}>
        数字加一：{count}
      </Button>
      <Button type='primary' onClick={() => setFlag((v) => !v)}>
        状态切换：{JSON.stringify(flag)}
      </Button>
    </Space>
  );
};

export default App;
```

**效果：**

<video src="/react/react18-hooks-api/setState05.mov" width="400" muted autoplay="autoplay" loop="loop"></video>

## 3. useContext

**useContext：** 上下文，类似于`Context`，其本意就是设置全局共享数据，使所有组件可跨层级实现共享。

`useContext`的参数一般是由`React.createContext`创建，通过`CountContext.Provider`包裹的组件，才能通过`useContext`获取对应的值。

**基本使用：**

```tsx
const contextValue = useContext(context);
```

**Params：**

- context：一般而言保存的是`context`对象。

**Result：**

- contextValue：返回的数据，也就是`context`对象内保存的`value`值。

**基本使用：** 子组件`Child`和孙组件`Son`，共享父组件`Index`的数据`count`。

```tsx
import { useState, createContext, useContext } from 'react';
import { Button } from 'antd';

const CountContext = createContext(-1);

const Child = () => {
  const count = useContext(CountContext);

  return (
    <div style={{ marginTop: 10 }}>
      子组件获取到的count: {count}
      <Son />
    </div>
  );
};

const Son = () => {
  const count = useContext(CountContext);

  return <div style={{ marginTop: 10 }}>孙组件获取到的count: {count}</div>;
};

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>父组件中的count：{count}</div>
      <Button type='primary' onClick={() => setCount((v) => v + 1)}>
        点击+1
      </Button>
      <CountContext.Provider value={count}>
        <Child />
      </CountContext.Provider>
    </>
  );
};

export default App;
```

**效果：**

<video src="/react/react18-hooks-api/setState06.mov" width="400" muted autoplay="autoplay" loop="loop"></video>

## 4. useReducer

**useReducer：** 功能类似于`redux`，与`redux`最大的不同点在于它是单个组件的状态管理，组件通讯还是要通过`props`。简单地说，`useReducer`相当于是`useState`的升级版，用来处理复杂的`state`变化。

**基本使用：**

```tsx
const [state, dispatch] = useReducer(
    (state, action) => {},
    initialArg,
    init
  );
```

**Params：**

- reducer：函数，可以理解为`redux`中的`reducer`，最终返回的值就是新的数据源`state`；
- initialArg：初始默认值；
- init：可选值，惰性初始化，用于计算初始值的函数。

::: info
问：什么是惰性初始化？

答：惰性初始化是一种延迟创建对象的手段，直到被需要的第一时间才去创建，目的是实现懒加载来提升性能。换句话说，如果有 init，就会取代 initialArg。
:::

**Result：**

- state：更新之后的数据源；
- dispatch：用于派发更新的`dispatchAction`，可以认为是`useState`中的`setState`。

**基本用法：**

```tsx
import { useReducer } from 'react';
import { Button } from 'antd';

const App = () => {
  const [count, dispatch] = useReducer((state: number, action: any) => {
    switch (action?.type) {
      case 'add':
        return state + action?.payload;
      case 'sub':
        return state - action?.payload;
      default:
        return state;
    }
  }, 0);

  return (
    <>
      <div>count：{count}</div>
      <Space>
        <Button type='primary' onClick={() => dispatch({ type: 'add', payload: 1 })}>
          加1
        </Button>
        <Button type='primary' onClick={() => dispatch({ type: 'sub', payload: 1 })}>
          减1
        </Button>
      </Space>
    </>
  );
};

export default App;
```

**效果：**

<video src="/react/react18-hooks-api/setState07.mov" width="400" muted autoplay="autoplay" loop="loop"></video>

**特别注意：** 在`reducer`中，如果返回的`state`和之前的`state`值相同，那么组件将不会更新。

比如这个组件是子组件，并不是组件本身，然后对上面的例子稍加更改：

```tsx
const Child = ({ count }: { count: number }) => {
  console.log('子组件发生更新');
  return <div>在子组件的count：{count}</div>;
};

const App = () => {
  const [count, dispatch] = useReducer((state: number, action: any) => {
    switch (action?.type) {
      case 'add':
        return state + action?.payload;
      case 'sub':
        return state - action?.payload;
      default:
        return state;
    }
  }, 0);

  return (
    <>
      <div>count：{count}</div>
      <Space>
        // ...
        <Button type='primary' onClick={() => dispatch({ type: 'no', payload: 1 })}>
          无关按钮
        </Button>
      </Space>

      <Child count={count} />
    </>
  );
};

export default App;
```

**效果：**

<video src="/react/react18-hooks-api/setState08.mov" width="400" muted autoplay="autoplay" loop="loop"></video>

可以看到，当 count 无变化时，子组件并不会更新。

## 5. useMemo

**场景：** 在每一次的状态更新中，都会让组件重新绘制，而重新绘制必然会带来不必要的性能开销，为了防止没有意义的性能开销，React Hooks 提供了`useMemo`函数。

**useMemo：** 理念与`memo`相同，都是判断是否满足当前的限定条件来决定是否执行`callback`函数。它之所以能带来提升，是因为在依赖不变的情况下，会返回相同的引用，避免子组件进行无意义的重复渲染。

**基本使用：**

```tsx
const cacheData = useMemo(fn, deps);
```

**Params：**

- fn：函数，函数的返回值会作为缓存值；
- deps：依赖项，数组，会通过数组里的值来判断是否进行`fn`的调用，如果发生了改变，则会得到新的缓存值。

**Result：**

- cacheData：更新之后的数据源，即`fn`函数的返回值，如果`deps`中的依赖值发生改变，将重新执行`fn`，否则取上一次的缓存值。

**问题源泉：**

```tsx
import { useState } from 'react';
import { Button } from 'antd';

const usePow = (list: number[]) => {
  return list.map((item: number) => {
    console.log('我是usePow');
    return Math.pow(item, 2);
  });
};

const App = () => {
  const [flag, setFlag] = useState(true);

  const data = usePow([1, 2, 3]);

  return (
    <>
      <div>数字集合：{JSON.stringify(data)}</div>
      <Button type='primary' onClick={() => setFlag((v) => !v)}>
        状态切换{JSON.stringify(flag)}
      </Button>
    </>
  );
};

export default App;
```

从例子中来看， 按钮切换的`flag`应该与`usePow`的数据毫无关系，那么可以猜一猜，当我们切换按钮的时候，`usePow`中是否会打印：我是 usePow ？

**效果：**

<video src="/react/react18-hooks-api/setState09.mov" width="400" muted autoplay="autoplay" loop="loop"></video>

可以看到，当点击按钮后，会打印我是`usePow`，这样就会产生开销。毫无疑问，这种开销并不是我们想要见到的结果，所以有了`useMemo`。 并用它进行如下改造：

```tsx
const usePow = (list: number[]) => {
  return useMemo(
    () =>
      list.map((item: number) => {
        console.log(1);
        return Math.pow(item, 2);
      }),
    []
  );
};
```

**效果：**

<video src="/react/react18-hooks-api/setState10.mov" width="400" muted autoplay="autoplay" loop="loop"></video>

## 6. useCallback

**useCallback：** 与`useMemo`极其类似，甚至可以说一模一样，唯一不同的点在于，`useMemo`返回的是值，而`useCallback`返回的是函数。

**基本使用：**

```tsx
const resfn = useCallback(fn, deps);
```

**Params：**

- fn：函数，函数的返回值会作为缓存值；
- deps：依赖项，数组，会通过数组里的值来判断是否进行`fn`的调用，如果依赖项发生改变，则会得到新的缓存值。

**Result：**

- resfn：更新之后的数据源，即`fn`函数，如果`deps`中的依赖值发生改变，将重新执行`fn`，否则取上一次的函数。

**基本用法：**

```tsx
import { useState, useCallback, memo } from 'react';
import { Button } from 'antd';

const App = () => {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(true);

  const add = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <>
      <TestButton onClick={() => setCount((v) => v + 1)}>普通点击</TestButton>
      <TestButton onClick={add}>useCallback点击</TestButton>
      <div>数字：{count}</div>
      <Button type='primary' onClick={() => setFlag((v) => !v)}>
        切换{JSON.stringify(flag)}
      </Button>
    </>
  );
};

const TestButton = memo(({ children, onClick = () => {} }: any) => {
  console.log(children);
  return (
    <Button
      type='primary'
      onClick={onClick}
      style={children === 'useCallback点击' ? { marginLeft: 10 } : undefined}
    >
      {children}
    </Button>
  );
});

export default App;
```

简要说明下，`TestButton`里是个按钮，分别存放着有无`useCallback`包裹的函数，在父组件`Index`中有一个`flag`变量，这个变量同样与`count`无关，那么切换按钮的时候，`TestButton`的执行如下：

<video src="/react/react18-hooks-api/setState11.mov" width="400" muted autoplay="autoplay" loop="loop"></video>

可以看到，切换`flag`的时候，没有经过`useCallback`的函数会再次执行，而包裹的函数并没有执行（点击“普通点击”按钮的时候，`useCallback`的依赖项`count`发生了改变，所以会打印出`useCallback`点击）。

::: info
问：为什么在 TestButton 中使用了 React.memo，不使用会怎样？

答：useCallback 必须配合 React.memo 进行优化，如果不配合使用，将不会起到性能优化的作用。
:::

## 7. useRef

**useRef：** 用于获取当前元素的所有属性，除此之外，还有一个高级用法：缓存数据。

**基本使用：**

```tsx
const ref = useRef(initialValue);
```

**Params：**

- initialValue：初始值，默认值。

**Result：**

- ref：返回的一个`current`对象，这个`current`属性就是`ref`对象需要获取的内容。

**基本用法：**

```tsx
import { useState, useRef } from 'react';

const App = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [clientHeight, setClientHeight] = useState<number>(0);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [scrollHeight, setScrollHeight] = useState<number>(0);

  const onScroll = () => {
    if (scrollRef?.current) {
      const clientHeight = scrollRef?.current.clientHeight; //可视区域高度
      const scrollTop = scrollRef?.current.scrollTop; //滚动条滚动高度
      const scrollHeight = scrollRef?.current.scrollHeight; //滚动内容高度
      setClientHeight(clientHeight);
      setScrollTop(scrollTop);
      setScrollHeight(scrollHeight);
    }
  };

  useEffect(() => onScroll(), []);

  return (
    <>
      <div>
        <p>可视区域高度：{clientHeight}</p>
        <p>滚动条滚动高度：{scrollTop}</p>
        <p>滚动内容高度：{scrollHeight}</p>
      </div>
      <div
        style={{ height: 200, border: '1px solid #000', overflowY: 'auto' }}
        ref={scrollRef}
        onScroll={onScroll}
      >
        <div style={{ height: 2000 }}></div>
      </div>
    </>
  );
};

export default App;
```

**效果：**

<video src="/react/react18-hooks-api/setState12.mov" width="400" muted autoplay="autoplay" loop="loop"></video>

## 8. useImperativeHandle

**useImperativeHandle：** 可以通过`ref`或`forwardRef`暴露给父组件的实例值，所谓的实例值是指值和函数。

实际上这个钩子非常有用，简单来讲，这个钩子可以让不同的模块关联起来，让父组件调用子组件的方法。

举个例子，在一个页面很复杂的时候，我们会将这个页面进行模块化，这样会分成很多个模块，有的时候我们需要在`最外层的组件上`控制其他组件的方法，希望最外层的点击事件同时执行`子组件的事件`，这时就需要`useImperativeHandle`的帮助。

**基本使用：**

```tsx
useImperativeHandle(ref, createHandle, deps);
```

**Params：**

- ref：接受`useRef`或`forwardRef`传递过来的`ref`；
- createHandle：处理函数，返回值作为暴露给父组件的`ref`对象；
- deps：依赖项，依赖项如果更改，会形成新的`ref`对象。

**父组件是函数式组件：**

```tsx
import { forwardRef, useState, useRef, useImperativeHandle } from 'react';
import { Button } from 'antd';

const Child = forwardRef((props, ref) => {
  const [count, setCount] = useState(0);

  useImperativeHandle(ref, () => ({ add }));

  const add = () => {
    setCount((v) => v + 1);
  };

  return (
    <div>
      <p>点击次数：{count}</p>
      <Button onClick={() => add()}> 子组件的按钮，点击+1</Button>
    </div>
  );
});

const App = () => {
  const ref = useRef<any>(null);

  return (
    <>
      <Button type='primary' onClick={() => ref.current.add()}>
        父组件上的按钮，点击+1
      </Button>
      <Child ref={ref} />
    </>
  );
};

export default App;
```

**效果：**

<video src="/react/react18-hooks-api/setState13.mov" width="400" muted autoplay="autoplay" loop="loop"></video>

**forwardRef：** 引用传递，是一种通过组件向子组件自动传递引用`ref`的技术。对于应用者的大多数组件来说没什么作用，但对于一些重复使用的组件，可能有用。

## 9. useLayoutEffect

**useLayoutEffect：** 与`useEffect`基本一致，不同点在于它是同步执行的。简要说明：

- 执行顺序：`useLayoutEffect`是在`DOM`更新之后，浏览器绘制之前的操作，这样可以更加方便地修改`DOM`，获取`DOM`信息，这样浏览器只会绘制一次，所以`useLayoutEffect`的执行顺序在`useEffect`之前；
- `useLayoutEffect`相当于有一层防抖效果；
- `useLayoutEffect`的`callback`中会阻塞浏览器绘制。

**基本使用：**

```tsx
useLayoutEffect(callback, deps);
```
