import * as React from 'react';
import './style.css';

export default function App() {
  return (
    <div className="container">
      <GridView key="row" direction="row">
        <div
          style={{ width: '100%', height: '100%', background: 'lightblue' }}
        />

        <GridView key="col" direction="col">
          <div
            style={{ width: '100%', height: '100%', background: 'lightblue' }}
          />
          <div
            style={{ width: '100%', height: '100%', background: 'lightgreen' }}
          />
        </GridView>
      </GridView>
    </div>
  );
}

function GridView({
  direction,
  children,
  defaultOffset = 50,
}: {
  children: React.ReactNode;
  direction: 'row' | 'col';
  defaultOffset?: number;
}) {
  const [firstRowOffset, setFirstRowOffset] = React.useState(
    () => defaultOffset
  );
  const [moving, setMoving] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>();

  const gridStyle: React.CSSProperties = React.useMemo(() => {
    if (direction === 'row') {
      return {
        gridTemplateColumns: `${firstRowOffset}% auto`,
      };
    }

    return {
      gridTemplateRows: `${firstRowOffset}% auto`,
    };
  }, [direction, firstRowOffset]);

  const splitStyle = React.useMemo(() => {
    if (direction === 'row') {
      return {
        width: 4,
        height: '100%',
        top: 0,
        left: `${firstRowOffset}%`,
        cursor: 'col-resize',
      };
    }

    return {
      height: 4,
      width: '100%',
      left: 0,
      top: `${firstRowOffset}%`,
      cursor: 'row-resize',
    };
  }, [direction, firstRowOffset]);

  const onMove = React.useCallback(
    (e) => {
      if (!moving || !ref?.current) return;
      const { width, left, height, top } = ref.current.getBoundingClientRect();

      let offset = 0;
      if (direction === 'row') {
        offset = Math.floor(((e.clientX - left) / width) * 10000) / 100;
      } else {
        offset = Math.floor(((e.clientY - top) / height) * 10000) / 100;
      }

      setFirstRowOffset(Math.min(100, Math.max(0, offset)));
    },
    [moving, direction]
  );

  return (
    <div
      className="gridView"
      style={gridStyle}
      ref={ref}
      onMouseMove={onMove}
      onMouseUp={() => setMoving(false)}
      onMouseLeave={() => setMoving(false)}
    >
      {children}

      <span
        className="gridSplit"
        style={splitStyle}
        onMouseDown={() => setMoving(true)}
      />
    </div>
  );
}
