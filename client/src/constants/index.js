import { createCampaign, dashboard, logout, payment, profile, withdraw, type } from '../assets';

export const navlinks = [
  {
    name: 'Dashboard',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'Past campaigns',
    imgUrl: type,
    link: '/past-campaigns',
  },
  {
    name: 'Create Campaign',
    imgUrl: createCampaign,
    link: '/create-campaign',
  },
  // {
  //   name: 'Payments',
  //   imgUrl: payment,
  //   link: '/payments',
  // },
  // {
  //   name: 'withdraw',
  //   imgUrl: withdraw,
  //   link: '/',
  //   disabled: true,
  // },
  {
    name: 'profile',
    imgUrl: profile,
    link: '/profile',
  },
];
export const nonUserNavlinks = [
  {
    name: 'Dashboard',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'Past campaigns',
    imgUrl: type,
    link: '/past-campaigns',
  },
  // {
  //   name: 'Create Campaign',
  //   imgUrl: createCampaign,
  //   link: '/create-campaign',
  // },
  // {
  //   name: 'Payments',
  //   imgUrl: payment,
  //   link: '/payments',
  // },
  // {
  //   name: 'withdraw',
  //   imgUrl: withdraw,
  //   link: '/',
  //   disabled: true,
  // },
  // {
  //   name: 'profile',
  //   imgUrl: profile,
  //   link: '/profile',
  // },
];
