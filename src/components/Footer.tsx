import { motion } from 'framer-motion';
import { footerVariants } from '@/utils/motion';
import MusicIcon from '@/icons/MusicIcon';
import Link from 'next/link';

const Footer = () => (
  <motion.footer variants={footerVariants} initial="hidden" whileInView="show" className={`x-paddings py-8 relative`}>
    <div className="footer-gradient" />
    <div className={`inner-width mx-auto flex flex-col gap-8`}>
      <div className="flex items-center justify-between flex-wrap gap-5">
        <h4 className="font-bold md:text-[64px] text-[44px] text-white">Enter the VizBeats</h4>
        <button type="button" className="flex items-center h-fit py-4 px-6 bg-[#25618B] rounded-[32px] gap-[12px]">
          <MusicIcon className="w-6 h-6 text-white" />
          <Link href={'/musics'}>
            <span className="font-normal text-[16px] text-white">Enter VizBeats</span>
          </Link>
        </button>
      </div>
      <div className="flex flex-col">
        <div className="mb-[50px] h-[2px] bg-white opacity-10" />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h4 className="font-extrabold text-[24px] text-white">VizBeats</h4>
          <p className="font-normal text-[14px] text-white opacity-50">
            Copyright © 2023 - 2024 VizBeats. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </motion.footer>
);

export default Footer;