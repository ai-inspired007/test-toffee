import React from 'react';
import type { SVGProps } from 'react';

export function RiCodeBlock(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m3.414 6l2.293-2.293l-1.414-1.414L.586 6l3.707 3.707l1.414-1.414zm6.172 0L7.293 3.707l1.414-1.414L12.414 6L8.707 9.707L7.293 8.293zM14 3h7a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8h2v7h16V5h-6z"></path></svg>);
}