import { AppLayout } from "@/modules"

export default function Privacy(){
  return (
    <AppLayout>
        <div className="w-full max-w-4xl px-4 pt-4 pb-1.5">
            <div className="text-left">
            <h1 className="text-3xl font-bold text-green-400 mb-6 text-center">
            Privacy Policy
          </h1>
          
          <div className="space-y-6 text-gray-300">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-green-300">1. Data Collection</h2>
              <p>
                We collect only essential information required for account functionality:
                email address, username, and encrypted password. Audio files you upload
                are stored solely for your personal use.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-green-300">2. Content Responsibility</h2>
              <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-yellow-500">
                <p className="font-medium">
                  <span className="text-yellow-400">Important:</span> Users are solely responsible 
                  for all uploaded content. By using this service, you affirm that you own 
                  the rights to all uploaded music or have obtained necessary permissions.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-green-300">3. Legal Compliance</h2>
              <p>
                This platform fully cooperates with law enforcement agencies and copyright 
                holders. We will:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Respond to valid DMCA takedown notices within 24 hours</li>
                <li>Provide account information when presented with proper legal documentation</li>
                <li>Permanently ban users violating copyright laws</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-green-300">4. Data Protection</h2>
              <p>
                We implement industry-standard security measures:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                <div className="bg-gray-700 p-3 rounded-lg">
                  <h3 className="font-medium text-green-200">Encryption</h3>
                  <p>TLS 1.3 for data transfer</p>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <h3 className="font-medium text-green-200">Access Control</h3>
                  <p>Strict employee access policies to user data</p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-green-300">5. Changes to Policy</h2>
              <p>
                We reserve the right to modify this policy. Significant changes will be
                communicated via email 30 days before taking effect.
              </p>
            </section>

            <div className="pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                Last updated: {new Date('2025-05-10').toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
            </div>
        </div>
    </AppLayout>
  )
}


