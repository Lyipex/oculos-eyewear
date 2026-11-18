import type {Metadata} from 'next'; import {Checkout} from '@/components/checkout';
export const metadata:Metadata={title:'Checkout demonstrativo',robots:{index:false,follow:false}};
export default function Page(){return <Checkout/>}
