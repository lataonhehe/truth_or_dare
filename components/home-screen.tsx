'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Settings, HelpCircle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface HomeScreenProps {
  onStartGame: () => void;
}

export function HomeScreen({ onStartGame }: HomeScreenProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-6">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-secondary blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent blur-[100px]" />
      </div>

      {/* Settings Button */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-6 top-6"
          >
            <Settings className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="font-[var(--font-fredoka)] text-2xl">
              Cài đặt
            </SheetTitle>
            <SheetDescription>
              Tùy chỉnh trải nghiệm game của bạn
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span>Âm thanh</span>
              <span className="text-muted-foreground">Đang phát triển</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Rung</span>
              <span className="text-muted-foreground">Đang phát triển</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ngôn ngữ</span>
              <span className="text-muted-foreground">Tiếng Việt</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-12">
        {/* Hero Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.h1
            className="font-[var(--font-fredoka)] text-8xl font-bold text-primary text-glow-green"
            animate={{
              textShadow: [
                '0 0 20px rgba(57, 255, 20, 0.5)',
                '0 0 40px rgba(57, 255, 20, 0.8)',
                '0 0 20px rgba(57, 255, 20, 0.5)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          >
            Spill It!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-2xl font-semibold text-muted-foreground"
          >
            Dám chơi - Dám chịu
          </motion.p>
        </motion.div>

        {/* Animated Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4"
        >
          {['truth', 'dare', 'do'].map((type, index) => {
            const colors = {
              truth: 'bg-accent glow-blue',
              dare: 'bg-secondary glow-pink',
              do: 'bg-destructive glow-red',
            };
            const labels = {
              truth: 'TRUTH',
              dare: 'DARE',
              do: 'DO IT',
            };
            return (
              <motion.div
                key={type}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: index * 0.3,
                  ease: 'easeInOut',
                }}
                className={`h-32 w-24 rounded-3xl ${colors[type as keyof typeof colors]} flex items-center justify-center`}
              >
                <span className="font-[var(--font-fredoka)] text-sm font-bold text-background">
                  {labels[type as keyof typeof labels]}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-4"
        >
          <Button
            size="lg"
            onClick={onStartGame}
            className="glow-green h-14 rounded-3xl bg-primary px-10 font-[var(--font-fredoka)] text-xl font-bold text-primary-foreground hover:bg-primary/90 sm:h-16 sm:px-16 sm:text-2xl"
          >
            <span className="whitespace-nowrap">CHƠI NGAY</span>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <HelpCircle className="h-5 w-5" />
                Hướng dẫn
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle className="font-[var(--font-fredoka)] text-3xl">
                  Cách chơi
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6 text-lg">
                <div>
                  <h3 className="font-[var(--font-fredoka)] text-xl font-bold text-primary">
                    1. Chọn chế độ
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    <span className="font-bold text-accent">Classic:</span>{' '}
                    Truth or Dare truyền thống
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-bold text-destructive">Chaos:</span>{' '}
                    Do or Drink - Làm hoặc uống!
                  </p>
                </div>

                <div>
                  <h3 className="font-[var(--font-fredoka)] text-xl font-bold text-primary">
                    2. Chọn độ cay
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    🟢 <span className="font-bold">Chill:</span> Nhẹ nhàng, vui vẻ
                  </p>
                  <p className="text-muted-foreground">
                    🟡 <span className="font-bold">Spicy:</span> Hơi nóng, thú vị
                  </p>
                  <p className="text-muted-foreground">
                    🔴 <span className="font-bold">Wild:</span> Điên cuồng, 18+
                  </p>
                </div>

                <div>
                  <h3 className="font-[var(--font-fredoka)] text-xl font-bold text-primary">
                    3. Lật thẻ và chơi
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Làm theo thử thách hoặc chịu hình phạt. Không có lùi bước!
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </motion.div>
      </div>
    </div>
  );
}
