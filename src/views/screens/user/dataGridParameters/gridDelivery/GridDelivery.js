import React from 'react';
import useViews from 'views';

function GridDelivery() {
  const {useComponents} = useViews();

  const {useTables} = useComponents();
  const {TableDelivery} = useTables();
  return (
    <>
      {' '}
      <div className="container-table">
        <TableDelivery />
      </div>
    </>
  );
}

export default GridDelivery;
