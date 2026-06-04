export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-surface-container" id="testimonials">
      <div className="container mx-auto px-margin">
        <h2 className="font-h2 text-h2 text-center mb-24 reveal">
          Trusted by <span className="text-primary">Industry Leaders</span>.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          <div className="glass-card p-lg rounded-xl shadow-lg reveal">
            <p className="font-body-lg text-body-lg italic mb-lg text-on-surface-variant">
              "CloudDrive's analytics changed how we manage our creative assets. The speed is unmatched."
            </p>
            <div className="flex items-center gap-md">
              <img
                alt="Sarah Miller"
                className="w-12 h-12 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRs_OuRRMfu2wdh7B4yZZa7DWGFl7eAg_k6sLNo-aqlowVGKnoXDsDMDPG5G4iyTP236v8FGbDAb4CTrlR3eriuUkuU3edvPPNzwhRXFBTOp4gPfiREPMmjkdNgNhpmpuyl1oiPO5Y2S-IEtB_MzlVFsscqHPz7Aym8JM4rHH-KvevgSTDUVjgUwQ3u3cA2YB91-NwrXHrtwVos7Yz1ajT_-WmcN6_0IIR71gElCPy-XZTLG4LTUzW_lWXMjyWAHxLhVkkupMY11DY"
              />
              <div>
                <div className="font-h3 text-h3 text-primary">Sarah Miller</div>
                <div className="font-label-sm text-label-sm opacity-60">
                  Design Director, PixelFlow
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-lg rounded-xl shadow-lg mt-8 md:mt-0 reveal">
            <p className="font-body-lg text-body-lg italic mb-lg text-on-surface-variant">
              "The security features like JWT and OTP give us peace of mind with sensitive client data."
            </p>
            <div className="flex items-center gap-md">
              <img
                alt="Marcus Chen"
                className="w-12 h-12 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuApY0zEt0hllRfkTDOqYhvURr6CFCyu5Sll9jOUxI9edS07Asm_7J7hdgw_EJFDm1SdE6qNsoI1WiF8AbTq7ItE0AcoSRdTCeeBcoiQx_MHi2ceA164BA3UrcnqyGRZmuNfd3v1nqCcMmvVIsq7adTyzAFvyszGTgnZpTFQl3vY8V_7C28iyIQEVF4RCkBfaatwfliA29RFnQVplz_GuQT-PB0sD1fU4BuVfqASWvzuVAcqGTMkKx6sBCoBrgp2jGJQMCUYA8KAfW4N"
              />
              <div>
                <div className="font-h3 text-h3 text-primary">Marcus Chen</div>
                <div className="font-label-sm text-label-sm opacity-60">CTO, SecureStack</div>
              </div>
            </div>
          </div>

          <div className="glass-card p-lg rounded-xl shadow-lg reveal">
            <p className="font-body-lg text-body-lg italic mb-lg text-on-surface-variant">
              "Sharing large video files used to be a nightmare. CloudDrive made it instant and secure."
            </p>
            <div className="flex items-center gap-md">
              <img
                alt="Elena Rodriguez"
                className="w-12 h-12 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuClWOdyhJQwkhWWCKye2N5TfyEFdJ_oSxiG_tfUQuEPviQh2LjhPO2DJSSAp7-acvLcKViNiEgGUxAQlSTBXQt6UZKgJC_slSdQ8bc2NwOYJoimZcTOMBBRuy_VH5QHfgXAIFcVP7Asyk7SBhdkSUm1L0rhYUSlbQkczo3CUp2Wx_EJbJFQWbnknhWazhkKcW6kXdUNfSBgIwmLC3BKH8vehah8T7IvP7hPIRG51IaF-xjUwGsM5H2CP5abM7ttZFwT6LiFdyeCwsXR"
              />
              <div>
                <div className="font-h3 text-h3 text-primary">Elena Rodriguez</div>
                <div className="font-label-sm text-label-sm opacity-60">
                  Founder, FrameWork Media
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
