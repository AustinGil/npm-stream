const defs = {
  dog: `<symbol viewBox="0 0 72 72" id="icon-dog"><path fill="#F4AA41" d="m23.5 14.585l-4.5 1.75l-7.25 8.5l-4.5 10.75l2 5.25c1.255 3.792 3.523 7.184 7.25 10l2.5-3.333s3.822 7.71 10.738 8.96c0 0 10.262 1.936 15.595-.877c3.42-1.803 4.417-4.416 4.417-4.416l3.417-3.417l1.583 2.333l2.083-.083l5.417-7.25L64 37.336l-.167-4.5l-2.333-5.5l-4.833-7.417S54 15.002 48.5 16.002c0 0-6.5-4.833-11.833-4.083s-4.584-1.25-13.167 2.666z"></path><path fill="#EA5A47" d="m36 47.252l-3.083 2.417h-2.5l-.084 3.833l.75 3.5l1.084 1.917l2.833 1.5l4.583-.583l1.584-1.75l1-4.25l-.25-4l-2 .25z"></path><path fill="#3F3F3F" d="m32.5 36.919l-1.583 3.75l2.166 1.25l1.25.5l4.334.167l2.916-2.25l-1.75-3.25z"></path><path d="M29.506 30.109s-1.805 1.242-2.748.668a2 2 0 0 1 2.08-3.417c.943.575.668 2.749.668 2.749z"></path><path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M33.109 37.006h6.146a1 1 0 0 1 .92.609l1.158 2.724l-2.18 1.146a1 1 0 0 1-1.456-.754m-2.937.032a1 1 0 0 1-1.364.747l-2.313-.952l1.09-2.903a1 1 0 0 1 .936-.649m-2.673 13.021s-.718 8.793 3.008 9.937c2.645.813 5.15.533 6.062-.25c.875-.75 2.632-4.474 1.827-9.687"></path><path d="M44.264 30.109s1.805 1.242 2.748.668a2 2 0 0 0-2.08-3.417c-.944.575-.668 2.749-.668 2.749z"></path><path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M25.625 42.84c-.475 3.602 2.234 5.75 4.284 6.84a3.415 3.415 0 0 0 3.718-.317l2.58-2.024l2.582 2.024a3.416 3.416 0 0 0 3.717.318c2.05-1.091 4.76-3.24 4.285-6.842"></path><path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M19.95 28.357c-2.316 5.16-.507 13.025.12 15.376a1.98 1.98 0 0 1-.127 1.363l-1.988 4.194c-.623 1.315-2.393 1.553-3.33.44c-3.193-3.786-8.559-11.39-6.55-16.685c7.063-18.61 15.869-18.143 15.869-18.143c2.845-1.934 13.104-6.938 24.812.875c0 0 8.632-1.718 14.938 16.937c1.803 5.337-3.43 12.867-6.551 16.645c-.931 1.127-2.716.893-3.342-.428l-1.975-4.165a1.978 1.978 0 0 1-.127-1.363c.628-2.351 2.436-10.216.12-15.376"></path><path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M52.63 46.463s-3.077 6.721-7.804 8.271m-25.389-7.765s3.078 6.082 7.805 7.632m8.966-7.262v-3.03"></path></symbol>`,
  'magnifying-glass': `<symbol viewBox="0 0 256 256" id="icon-magnifying-glass">
  <path
    fill="currentColor"
    d="m229.7 218.3l-43.3-43.2a92.2 92.2 0 1 0-11.3 11.3l43.2 43.3a8.2 8.2 0 0 0 11.4 0a8.1 8.1 0 0 0 0-11.4ZM40 116a76 76 0 1 1 76 76a76.1 76.1 0 0 1-76-76Z"
  ></path>
</symbol>`,
};

/** @typedef {keyof defs} SvgIconNames */

export default function SvgSymbols() {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: '0',
        height: '0',
        overflow: 'hidden',
      }}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs dangerouslySetInnerHTML={{ __html: Object.values(defs).join() }}>
        {/* <symbol viewBox="0 0 256 256" id="icon-magnifying-glass">
          <path
            fill="currentColor"
            d="m229.7 218.3l-43.3-43.2a92.2 92.2 0 1 0-11.3 11.3l43.2 43.3a8.2 8.2 0 0 0 11.4 0a8.1 8.1 0 0 0 0-11.4ZM40 116a76 76 0 1 1 76 76a76.1 76.1 0 0 1-76-76Z"
          ></path>
        </symbol> */}
      </defs>
    </svg>
  );
}
