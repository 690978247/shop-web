/* eslint-disable no-unused-vars */
import facebookImg from '@/assets/images/home/footer-facebook.svg'
import youtubeImg from '@/assets/images/home/footer-youtube.svg'
import insImg from '@/assets/images/home/footer-ins.svg'
import whatsappImg from '@/assets/images/home/footer-whatsapp.svg'

export const productTypeMap = {
  0: 'Single Product',
  1: 'Top 100 Product',
  2: 'Winner Product'
}

export enum EnumProductTypes {
  SingleProduct = 0,
  Top100Product = 1,
  WinnerProduct = 2
}

export enum EnumMemberTypes {
  Free = 1,
  Pro = 2,
  Plus = 3
}

export const MEMBER_DISCOUNT = [0, 1, 0.985, 0.97]

export const countryList = [
  'IE',
  'EE',
  'AT',
  'BR',
  'BG',
  'BE',
  'PL',
  'DK',
  'DE',
  'FR',
  'FI',
  'NL',
  'CZ',
  'HR',
  'LV',
  'LT',
  'LU',
  'RO',
  'MT',
  'PT',
  'SE',
  'CY',
  'SK',
  'SI',
  'ES',
  'GR',
  'HU',
  'IT'
]

/* 社媒信息 */
export const icons = [
  {
    img: facebookImg,
    url: 'https://www.facebook.com/USAdrop'
  },
  {
    img: youtubeImg,
    url: 'https://www.youtube.com/channel/UCZQuwxBMdUVvssLOZS2KqHw'
  },
  {
    img: insImg,
    url: 'https://www.instagram.com/usadrop_official'
  },
  {
    img: whatsappImg,
    url: 'https://wa.me/message/CWQN37VUS2INC1'
  }
]
