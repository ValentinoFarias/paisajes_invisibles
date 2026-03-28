"use client";
// GalleryLayout.jsx
// Full-page photo gallery with dark theme and category sidebar.
//
// To add photos to a category: add { src, alt } objects to the array
// under the matching key in GALLERY_CATEGORIES below.

import { useState } from "react";

// ── Add photos here under each category ──────────────────────────────────────
const GALLERY_CATEGORIES = {
  Grafica: [],

  Paisajes: [
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369744/paisajeinvisible_IR_JAM_021_zigmne.webp", alt: "PAISAJE" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369742/paisajeinvisible_IR_JAM_020_fqzv4x.webp", alt: "PAISAJE" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369740/paisajeinvisible_IR_JAM_019_hcdvv9.webp", alt: "PAISAJE" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369739/paisajeinvisible_IR_JAM_018_gcz9eb.webp", alt: "PAISAJE" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369736/paisajeinvisible_IR_JAM_017_pntaxj.webp", alt: "PAISAJE" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369735/paisajeinvisible_IR_JAM_016_mkecry.webp", alt: "PAISAJE" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369733/paisajeinvisible_IR_JAM_015_wcrwkb.webp", alt: "PAISAJE" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369731/paisajeinvisible_IR_JAM_014_osp7ao.webp", alt: "PAISAJE" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369666/paisajeinvisible_IR_JAM_013_vrfuxn.webp", alt: "PAISAJE" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369665/paisajeinvisible_IR_JAM_012_zzwnkj.webp", alt: "PAISAJE" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369615/paisajeinvisible_IR_JAM_011_h39qyt.webp", alt: "PAISAJE" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369614/paisajeinvisible_IR_JAM_010_keqmrm.webp", alt: "PAISAJE" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369606/paisajeinvisible_IR_JAM_009_xxpqdm.webp", alt: "PAISAJE" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369572/paisajeinvisible_IR_JAM_008_kundvy.webp", alt: "PAISAJE" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369563/paisajeinvisible_IR_JAM_007_zz81tc.webp", alt: "PAISAJE" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369479/paisajeinvisible_IR_JAM_006_iqg7cn.webp", alt: "PAISAJE" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369477/paisajeinvisible_IR_JAM_005_uixy2w.webp", alt: "PAISAJE" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369476/paisajeinvisible_IR_JAM_004_hekezz.webp", alt: "PAISAJE" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369475/paisajeinvisible_IR_JAM_001_vgnfig.webp", alt: "PAISAJE" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369474/paisajeinvisible_IR_JAM_003_zo1hqf.webp", alt: "PAISAJE" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774369473/paisajeinvisible_IR_JAM_002_g2vsba.webp", alt: "PAISAJE" },
  ],

  Protestas: [
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365789/008_09_nuestramirada_Victimas_Chile__JAM2503_z3bjqr.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365788/002_09_nuestramirada_Victimas_Chile__JAM0086_sm0scp.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365786/001_09_nuestramirada_Victimas_Chile__JAM7447_toczqe.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365784/_JAM9289_xd9ona.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365782/_JAM9237_n0afyw.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365781/_JAM9052_owqhzm.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365779/_JAM8965_rgnxp9.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365777/_JAM8869_eplrxd.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365775/_JAM8839_hjochq.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365773/_JAM8587_protesta_muerte_jorge_mora039_jlcm7f.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365771/_JAM8433_h7tpwc.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365770/_JAM8380_nkeg99.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365768/_JAM8319_protesta_muerte_jorge_mora029_vjltpy.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365766/_JAM8221_protesta_muerte_jorge_mora027_os9hna.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365764/_JAM8055_protesta_muerte_jorge_mora022_uwq1dv.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365763/_JAM8027_aivwxb.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365758/_JAM7578_ymfuew.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365756/_JAM7566_u5lgrr.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365754/_JAM7546_z1vy1w.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365752/_JAM7540_ae3scm.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365750/_JAM7447_ao27uc.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365749/_JAM7193_yocnrx.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365747/_JAM7071_l1eda8.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365745/_JAM7038_kfnzev.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365743/_JAM7017_lnfrrs.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365742/_JAM6963_bgxs7p.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365740/_JAM6817_ng24nb.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365738/_JAM6264_zohzzj.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365736/_JAM6205_cxrkrc.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365735/_JAM6172_usdpwp.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365724/_JAM6141_mrznks.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365722/_JAM6127_yawg29.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365721/_JAM6049_kurouc.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365711/_JAM4584_antm0m.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365709/_JAM4539_f12la7.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365708/_JAM3973_j72d8w.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365706/_JAM3744_ktdksv.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365704/_JAM3669_lwrzgr.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365702/_JAM3639_dm2gum.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365701/_JAM3631_ngzhif.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365604/_JAM3620_jsiacl.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365602/_JAM3603_tk7csf.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365600/_JAM3581_mmfxgt.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365599/_JAM3522_yvg1mf.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365542/_JAM3492_s2pa4j.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365540/_JAM3471_gpg2sd.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365538/_JAM3176_xuknok.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365460/_JAM3173_uajovg.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365458/_JAM3125_o2vryp.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365456/_JAM2690_1_ijcba3.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365455/_JAM2423_apid0h.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365453/_JAM2355_xhrri7.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365451/_JAM1411_cxe5eg.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365450/_JAM1285_xfa1lw.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365448/_JAM1224_vd9qsg.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365446/_JAM1221_uy7xkk.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365445/_JAM1160_pmikri.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365443/_JAM1136_idnruu.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365442/_JAM1110_zmza7o.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365440/_JAM1049_rq0bd7.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365438/_JAM1026_s5vxyy.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365437/_JAM1002_dusyu7.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365435/_JAM0830_d9mhm7.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365433/_JAM0787_mfrjzs.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365422/_JAM0709_trdift.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365421/_JAM0703_unypmp.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365419/_JAM0660_lpet1p.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365417/_JAM0636_uesp3y.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365344/_JAM0589_xqypua.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365342/_JAM0532_axo1nz.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365340/_JAM0530_zk24ln.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365339/_JAM0524_tii9ew.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365296/_JAM0502_w0atfg.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365294/_JAM0474_eel49d.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365293/_JAM0393_bcbzfp.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365289/_JAM0322_phbmqb.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365273/_JAM0235_mld6pw.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365272/_JAM0159_yyxiqz.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365270/_JAM0099_1_xqhlas.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365269/_JAM0057_zfxncr.webp", alt: "PROTESTA" },
    { src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365268/_JAM0053_yzhq2f.webp", alt: "PROTESTA" },
  ],
};

export const CATEGORIES = Object.keys(GALLERY_CATEGORIES); // ["Grafica", "Paisajes", "Protestas"]

// useGalleryLayout — all state and logic for the gallery.
// GalleryPage imports this and handles the rendering.
//
// sanityPhotos: object with { Grafica: [...], Paisajes: [...], Protestas: [...] }
// fetched from Sanity on the server. These appear FIRST, then Cloudinary photos follow.
export function useGalleryLayout(sanityPhotos = {}) {
  // Which category tab is active
  const [activeCategory, setActiveCategory] = useState("Paisajes");

  // Photo open in the lightbox (null = closed)
  const [lightbox, setLightbox] = useState(null);

  // Merge: Sanity photos first, then Cloudinary photos after
  const sanity = sanityPhotos[activeCategory] || [];
  const cloudinary = GALLERY_CATEGORIES[activeCategory] || [];
  const photos = [...sanity, ...cloudinary];

  // Close lightbox on Escape key
  function handleKeyDown(e) {
    if (e.key === "Escape") setLightbox(null);
  }

  return {
    activeCategory,
    setActiveCategory,
    photos,
    lightbox,
    setLightbox,
    handleKeyDown,
  };
}
