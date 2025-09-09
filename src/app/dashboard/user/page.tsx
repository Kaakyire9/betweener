"use client";
import React from "react";
import { motion } from "framer-motion";
import ProfileSection from "./components/ProfileSection";
import ProfileProgress from "./components/ProfileProgress";
import ProfileInsights from "./components/ProfileInsights";
import ProfileAnalytics from "./components/ProfileAnalytics";
import MatchFeed from "./components/MatchFeed";
import DiscoveryFilters from "./components/DiscoveryFilters";
import BoostsSuperLikes from "./components/BoostsSuperLikes";
import PremiumFeatures from "./components/PremiumFeatures";
import SafetyTools from "./components/SafetyTools";
import Gamification from "./components/Gamification";
import CommunityEvents from "./components/CommunityEvents";
import MediaGallery from "./components/MediaGallery";
import NotificationsCenter from "./components/NotificationsCenter";
import SupportFeedback from "./components/SupportFeedback";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Top Profile Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex flex-col gap-8">
            <motion.section
              className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-3 border border-blue-100 hover:shadow-2xl transition-shadow"
              initial="hidden"
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
              variants={sectionVariants}
            >
              <ProfileSection />
            </motion.section>
            <motion.section
              className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-3 border border-blue-100 hover:shadow-2xl transition-shadow"
              initial="hidden"
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
              variants={sectionVariants}
            >
              <ProfileProgress />
            </motion.section>
            <motion.section
              className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-3 border border-blue-100 hover:shadow-2xl transition-shadow"
              initial="hidden"
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
              variants={sectionVariants}
            >
              <ProfileInsights />
            </motion.section>
            <motion.section
              className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-3 border border-blue-100 hover:shadow-2xl transition-shadow"
              initial="hidden"
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
              variants={sectionVariants}
            >
              <ProfileAnalytics />
            </motion.section>
          </div>
          <div className="md:col-span-2 flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.section
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-3 border border-blue-100 hover:shadow-2xl transition-shadow"
                initial="hidden"
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
                variants={sectionVariants}
              >
                <MatchFeed />
              </motion.section>
              <motion.section
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-3 border border-blue-100 hover:shadow-2xl transition-shadow"
                initial="hidden"
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
                variants={sectionVariants}
              >
                <DiscoveryFilters />
              </motion.section>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.section
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-3 border border-blue-100 hover:shadow-2xl transition-shadow"
                initial="hidden"
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
                variants={sectionVariants}
              >
                <BoostsSuperLikes />
              </motion.section>
              <motion.section
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-3 border border-blue-100 hover:shadow-2xl transition-shadow"
                initial="hidden"
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
                variants={sectionVariants}
              >
                <PremiumFeatures />
              </motion.section>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.section
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-3 border border-blue-100 hover:shadow-2xl transition-shadow"
                initial="hidden"
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
                variants={sectionVariants}
              >
                <SafetyTools />
              </motion.section>
              <motion.section
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-3 border border-blue-100 hover:shadow-2xl transition-shadow"
                initial="hidden"
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
                variants={sectionVariants}
              >
                <Gamification />
              </motion.section>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.section
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-3 border border-blue-100 hover:shadow-2xl transition-shadow"
                initial="hidden"
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
                variants={sectionVariants}
              >
                <CommunityEvents />
              </motion.section>
              <motion.section
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-3 border border-blue-100 hover:shadow-2xl transition-shadow"
                initial="hidden"
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
                variants={sectionVariants}
              >
                <MediaGallery />
              </motion.section>
            </div>
          </div>
        </div>
        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.section
            className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-3 border border-blue-100 hover:shadow-2xl transition-shadow"
            initial="hidden"
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
            variants={sectionVariants}
          >
            <NotificationsCenter />
          </motion.section>
          <motion.section
            className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-3 border border-blue-100 hover:shadow-2xl transition-shadow"
            initial="hidden"
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
            variants={sectionVariants}
          >
            <SupportFeedback />
          </motion.section>
        </div>
      </div>
    </div>
  );
}
