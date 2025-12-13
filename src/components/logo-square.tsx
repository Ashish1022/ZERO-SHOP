import clsx from 'clsx';

import LogoIcon from './icon';

export default function LogoSquare({ size }: { size?: 'sm' | undefined }) {
  return (
    <div
      className={clsx(
        'flex flex-none items-center justify-center border border-neutral-700 bg-black',
        {
          'h-10 w-10 rounded-xl': !size,
          'h-[30px] w-[30px] rounded-lg': size === 'sm'
        }
      )}
    >
      <LogoIcon
        className={clsx({
          'h-4 w-4': !size,
          'h-2.5 w-2.5': size === 'sm'
        })}
      />
    </div>
  );
}
